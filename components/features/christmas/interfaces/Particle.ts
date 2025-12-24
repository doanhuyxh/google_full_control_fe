import * as THREE from 'three';
export type TreeMode = 'TREE' | 'SCATTER' | 'FOCUS' | 'FOCUS_RANDOM';

export class Particle {
    mesh: THREE.Object3D;
    type: string;
    isDust: boolean;
    posTree: THREE.Vector3;
    posScatter: THREE.Vector3;
    baseScale: number;
    spinSpeed: THREE.Vector3;

    constructor(mesh: THREE.Object3D, type: string, isDust: boolean, config: any) {
        this.mesh = mesh;
        this.type = type;
        this.isDust = isDust;
        this.posTree = new THREE.Vector3();
        this.posScatter = new THREE.Vector3();
        this.baseScale = mesh.scale.x;

        const speedMult = (type === 'PHOTO') ? 0.3 : 2.0;
        this.spinSpeed = new THREE.Vector3(
            (Math.random() - 0.5) * speedMult,
            (Math.random() - 0.5) * speedMult,
            (Math.random() - 0.5) * speedMult
        );

        this.calculatePositions(config);
    }

    private calculatePositions(config: any) {
        // Logic cho PHOTO (Ảnh)
        if (this.type === 'PHOTO') {
            this.posTree.set(0, 0, 0);
            const rScatter = 8 + Math.random() * 12;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            this.posScatter.setFromSphericalCoords(rScatter, phi, theta);
            return;
        }

        // Logic cho cây thông (Tree shape)
        const h = config.particles.treeHeight;
        const t = Math.pow(Math.random(), 0.8);
        const y = (t * h) - (h / 2);
        const rMax = Math.max(0.5, config.particles.treeRadius * (1.0 - t));
        const angle = t * 50 * Math.PI + Math.random() * Math.PI;
        const r = rMax * (0.8 + Math.random() * 0.4);
        this.posTree.set(Math.cos(angle) * r, y, Math.sin(angle) * r);

        // Logic cho Scatter (Nổ tung)
        const rScatter = this.isDust ? (12 + Math.random() * 20) : (8 + Math.random() * 12);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        this.posScatter.setFromSphericalCoords(rScatter, phi, theta);
    }

    public update(dt: number, mode: TreeMode, focusTargetMesh: THREE.Object3D | null, clock: THREE.Clock, mainGroupMatrix: THREE.Matrix4, cameraPos: THREE.Vector3) {
        let target = (mode === 'SCATTER') ? this.posScatter : this.posTree;

        // Xử lý chế độ FOCUS
        if (mode === 'FOCUS') {
            if (this.mesh === focusTargetMesh) {
                const desiredWorldPos = new THREE.Vector3(0, 2, 35);
                const invMatrix = new THREE.Matrix4().copy(mainGroupMatrix).invert();
                target = desiredWorldPos.applyMatrix4(invMatrix);
            } else {
                target = this.posScatter;
            }
        }

        // Di chuyển (Lerp Position)
        const lerpSpeed = (mode === 'FOCUS' && this.mesh === focusTargetMesh) ? 5.0 : 2.0;
        this.mesh.position.lerp(target, lerpSpeed * dt);

        // Xoay hạt (Rotation)
        if (mode === 'SCATTER') {
            this.mesh.rotation.x += this.spinSpeed.x * dt;
            this.mesh.rotation.y += this.spinSpeed.y * dt;
            this.mesh.rotation.z += this.spinSpeed.z * dt;
        } else if (mode === 'TREE') {
            if (this.type === 'PHOTO') {
                this.mesh.lookAt(0, this.mesh.position.y, 0);
                this.mesh.rotateY(Math.PI);
            } else {
                this.mesh.rotation.x = THREE.MathUtils.lerp(this.mesh.rotation.x, 0, dt);
                this.mesh.rotation.z = THREE.MathUtils.lerp(this.mesh.rotation.z, 0, dt);
                this.mesh.rotation.y += 0.5 * dt;
            }
        }

        // LookAt Camera khi Focus
        if (mode === 'FOCUS' && this.mesh === focusTargetMesh) {
            this.mesh.lookAt(cameraPos);
        }

        // Hiệu ứng Scale (Biến mất/Hiện ra)
        let s = this.baseScale;
        if (this.isDust) {
            s = this.baseScale * (0.8 + 0.4 * Math.sin(clock.elapsedTime * 4 + this.mesh.id));
            if (mode === 'TREE') s = 0;
        } else if (mode === 'SCATTER' && this.type === 'PHOTO') {
            s = this.baseScale * 2.5;
        } else if (mode === 'FOCUS') {
            s = (this.mesh === focusTargetMesh) ? 4.5 : this.baseScale * 0.8;
        }
        this.mesh.scale.lerp(new THREE.Vector3(s, s, s), 4 * dt);
    }
}