import * as THREE from 'three';
import { Particle } from './Particle';

// --- HELPER: Tạo Geometry cho kẹo gậy ---
function createCandyCaneGeometry() {
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 0.3, 0),
        new THREE.Vector3(0.1, 0.5, 0), new THREE.Vector3(0.3, 0.4, 0)
    ]);
    return new THREE.TubeGeometry(curve, 16, 0.08, 8, false);
}

// --- HELPER: Tạo Texture cho kẹo gậy ---
function createCandyCaneTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 128, 128);
        ctx.fillStyle = '#880000'; ctx.beginPath();
        for (let i = -128; i < 256; i += 32) {
            ctx.moveTo(i, 0); ctx.lineTo(i + 32, 128); ctx.lineTo(i + 16, 128); ctx.lineTo(i - 16, 0);
        }
        ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
}

// --- MAIN FUNCTION ---
export function createTreeParticles(mainGroup: THREE.Group, particleSystem: Particle[], config: any) {
    // 1. Chuẩn bị Geometries
    const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const boxGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    const candyGeo = createCandyCaneGeometry();
    const dustGeo = new THREE.TetrahedronGeometry(0.08, 0);

    // 2. Chuẩn bị Materials
    const goldMat = new THREE.MeshStandardMaterial({
        color: config.colors.champagneGold, metalness: 1.0, roughness: 0.1,
        emissive: 0x443300, emissiveIntensity: 0.3
    });
    const greenMat = new THREE.MeshStandardMaterial({
        color: config.colors.deepGreen, metalness: 0.2, roughness: 0.8,
        emissive: 0x002200, emissiveIntensity: 0.2
    });
    const redMat = new THREE.MeshPhysicalMaterial({
        color: config.colors.accentRed, metalness: 0.3, roughness: 0.2,
        clearcoat: 1.0, emissive: 0x330000
    });
    const candyMat = new THREE.MeshStandardMaterial({
        map: createCandyCaneTexture(), roughness: 0.4
    });
    const dustMat = new THREE.MeshBasicMaterial({
        color: 0xffeebb, transparent: true, opacity: 0.8
    });

    // 3. Tạo hạt chính (Ornaments)
    for (let i = 0; i < config.particles.count; i++) {
        const rand = Math.random();
        let mesh, type;

        if (rand < 0.40) { mesh = new THREE.Mesh(boxGeo, greenMat); type = 'BOX'; }
        else if (rand < 0.70) { mesh = new THREE.Mesh(boxGeo, goldMat); type = 'GOLD_BOX'; }
        else if (rand < 0.92) { mesh = new THREE.Mesh(sphereGeo, goldMat); type = 'GOLD_SPHERE'; }
        else if (rand < 0.97) { mesh = new THREE.Mesh(sphereGeo, redMat); type = 'RED'; }
        else { mesh = new THREE.Mesh(candyGeo, candyMat); type = 'CANE'; }

        const s = 0.4 + Math.random() * 0.5;
        mesh.scale.set(s, s, s);
        mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);

        mainGroup.add(mesh);
        // Push class Particle đã tách file
        particleSystem.push(new Particle(mesh, type, false, config));
    }

    // 4. Tạo bụi tiên (Dust)
    for (let i = 0; i < config.particles.dustCount; i++) {
        const mesh = new THREE.Mesh(dustGeo, dustMat);
        mesh.scale.setScalar(0.5 + Math.random());
        mainGroup.add(mesh);
        particleSystem.push(new Particle(mesh, 'DUST', true, config));
    }
}