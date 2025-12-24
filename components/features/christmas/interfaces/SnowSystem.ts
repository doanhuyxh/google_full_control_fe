import * as THREE from 'three';

export function createSnow(scene: THREE.Scene, config: any) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const velocities = [];

    // Tạo texture bông tuyết
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const context = canvas.getContext('2d');
    if (context) {
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(16, 16, 16, 0, Math.PI * 2);
        context.fill();
    }
    const snowTexture = new THREE.CanvasTexture(canvas);

    for (let i = 0; i < config.particles.snowCount; i++) {
        vertices.push(
            THREE.MathUtils.randFloatSpread(100),
            THREE.MathUtils.randFloatSpread(60),
            THREE.MathUtils.randFloatSpread(60)
        );
        velocities.push(Math.random() * 0.2 + 0.1, Math.random() * 0.05);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('userData', new THREE.Float32BufferAttribute(velocities, 2));

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.4,
        map: snowTexture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const snowSystem = new THREE.Points(geometry, material);
    scene.add(snowSystem);

    return snowSystem;
}

export function updateSnow(snowSystem: THREE.Points | null, clock: THREE.Clock) {
    if (!snowSystem) return;

    const positions = snowSystem.geometry.attributes.position.array as Float32Array;
    const userData = snowSystem.geometry.attributes.userData.array as Float32Array;

    for (let i = 0; i < positions.length / 3; i++) {
        const fallSpeed = userData[i * 2];
        const swaySpeed = userData[i * 2 + 1];

        positions[i * 3 + 1] -= fallSpeed; // Y axis
        positions[i * 3] += Math.sin(clock.elapsedTime * 2 + i) * swaySpeed * 0.1; // X axis

        // Reset snow to top
        if (positions[i * 3 + 1] < -30) {
            positions[i * 3 + 1] = 30;
            positions[i * 3] = THREE.MathUtils.randFloatSpread(100);
            positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(60);
        }
    }

    snowSystem.geometry.attributes.position.needsUpdate = true;
}