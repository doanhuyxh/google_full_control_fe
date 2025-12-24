"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

// Import Modular Logic
import { createSnow, updateSnow } from '@/components/features/christmas/interfaces/SnowSystem';
import { createTreeParticles } from '@/components/features/christmas/interfaces/TreeBuilder';
import { Particle, TreeMode } from '@/components/features/christmas/interfaces/Particle';
// Import UI
import UIOverlay from './UIOverlay';

// --- CONFIG ---
const CONFIG = {
    colors: { bg: 0x050d1a, fog: 0x050d1a, champagneGold: 0xffd966, deepGreen: 0x03180a, accentRed: 0x990000 },
    particles: { count: 1500, dustCount: 2000, snowCount: 1000, treeHeight: 24, treeRadius: 8 },
    camera: { z: 50 },
    preload: { useCloudImages: true, cloudImageUrls: [] as string[] }
};

export default function ChristmasScene() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // React State for UI
    const [loading, setLoading] = useState(true);
    const [isCameraActive, setIsCameraActive] = useState(false);

    // Mutable State (Refs) for Three.js Loop
    const sceneRef = useRef<any>({
        scene: null, camera: null, renderer: null, composer: null,
        mainGroup: null, particleSystem: [] as Particle[], snowSystem: null,
        photoMeshGroup: null, clock: new THREE.Clock(),
        mode: 'TREE' as TreeMode,
        focusTarget: null as THREE.Object3D | null,
        rotation: { x: 0, y: 0 },
        hand: { detected: false, x: 0, y: 0 },
        handLandmarker: null as any
    });

    const predictWebcamRef = useRef<() => void>(null);

    // --- 1. INITIALIZATION ---
    useEffect(() => {
        if (!containerRef.current) return;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Init Three.js
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(CONFIG.colors.bg);
        scene.fog = new THREE.FogExp2(CONFIG.colors.fog, 0.015);

        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
        camera.position.set(0, 2, CONFIG.camera.z);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 2.2;
        containerRef.current.appendChild(renderer.domElement);

        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        // Environment & Lights
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambient);
        const innerLight = new THREE.PointLight(0xffaa00, 2, 20);
        innerLight.position.set(0, 5, 0);
        mainGroup.add(innerLight);

        const spotGold = new THREE.SpotLight(0xffcc66, 1200);
        spotGold.position.set(30, 40, 40); spotGold.angle = 0.5; spotGold.penumbra = 0.5;
        scene.add(spotGold);

        const spotBlue = new THREE.SpotLight(0x6688ff, 800);
        spotBlue.position.set(-30, 20, -30);
        scene.add(spotBlue);

        // Post Processing
        const renderScene = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0.98; bloomPass.strength = 0.2; bloomPass.radius = 0.2;
        const composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);

        // Group dành riêng cho ảnh
        const photoMeshGroup = new THREE.Group();
        mainGroup.add(photoMeshGroup);

        // Store in Ref
        sceneRef.current.scene = scene;
        sceneRef.current.camera = camera;
        sceneRef.current.renderer = renderer;
        sceneRef.current.composer = composer;
        sceneRef.current.mainGroup = mainGroup;
        sceneRef.current.photoMeshGroup = photoMeshGroup;

        // --- CREATE OBJECTS ---
        // Sử dụng module đã tách
        createTreeParticles(mainGroup, sceneRef.current.particleSystem, CONFIG);
        sceneRef.current.snowSystem = createSnow(scene, CONFIG);

        // Add Star (Optional - Giữ lại cho đẹp)
        const starGeo = new THREE.OctahedronGeometry(1.5, 0);
        const starMat = new THREE.MeshStandardMaterial({ color: 0xffdd88, emissive: 0xffaa00, emissiveIntensity: 1.0, metalness: 1.0, roughness: 0 });
        const star = new THREE.Mesh(starGeo, starMat);
        star.position.set(0, CONFIG.particles.treeHeight / 2 + 1.2, 0);
        mainGroup.add(star);

        // --- ANIMATION LOOP ---
        const animate = () => {
            requestAnimationFrame(animate);
            const state = sceneRef.current;
            const dt = state.clock.getDelta();

            // Logic quay cây / hand gesture
            if (state.hand.detected) {
                if (state.mode === 'SCATTER') {
                    const targetRotY = state.hand.x * Math.PI * 0.9;
                    const targetRotX = state.hand.y * Math.PI * 0.25;
                    state.rotation.y += (targetRotY - state.rotation.y) * 3.0 * dt;
                    state.rotation.x += (targetRotX - state.rotation.x) * 3.0 * dt;
                } else {
                    state.rotation.y += 0.3 * dt;
                }
            } else {
                // Auto idle
                if (state.mode === 'TREE') {
                    state.rotation.y += 0.3 * dt;
                    state.rotation.x += (0 - state.rotation.x) * 2.0 * dt;
                } else {
                    state.rotation.y += 0.1 * dt;
                }
            }

            state.mainGroup.rotation.y = state.rotation.y;
            state.mainGroup.rotation.x = state.rotation.x;

            // Update Particles
            // Quan trọng: Truyền đúng tham số cho method update của Particle class mới
            state.particleSystem.forEach((p: Particle) =>
                p.update(dt, state.mode, state.focusTarget, state.clock, state.mainGroup.matrixWorld, state.camera.position)
            );

            // Update Snow
            updateSnow(state.snowSystem, state.clock);

            composer.render();
        };

        animate();
        setLoading(false);

        // Handle Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            if (containerRef.current) containerRef.current.innerHTML = '';
        };
    }, []);

    // --- 2. HANDLERS ---

    const predictWebcam = useCallback(() => {
        const video = videoRef.current;
        const landmarker = sceneRef.current.handLandmarker;
        if (!video || !landmarker) return;
        const nowInMs = performance.now();
        if (video.currentTime !== landmarker.lastVideoTime) {
            const result = landmarker.detectForVideo(video, nowInMs);
            processGestures(result, sceneRef.current);
            landmarker.lastVideoTime = video.currentTime;
        }
        if (predictWebcamRef.current) {
            requestAnimationFrame(predictWebcamRef.current);
        }
    }, []);



    const handleSetMode = (mode: string) => {
        const state = sceneRef.current;
        if (mode === 'FOCUS_RANDOM') {
            state.mode = 'FOCUS';
            const photos = state.particleSystem.filter((p: Particle) => p.type === 'PHOTO');
            if (photos.length) state.focusTarget = photos[Math.floor(Math.random() * photos.length)].mesh;
        } else {
            state.mode = mode;
            if (mode === 'TREE') state.focusTarget = null;
        }
    };

    const handleToggleCamera = async () => {
        if (isCameraActive) return;
        try {
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
            const handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numHands: 1
            });

            sceneRef.current.handLandmarker = handLandmarker;

            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.addEventListener("loadeddata", predictWebcam);
            }
            setIsCameraActive(true);
        } catch (error) {
            console.error("Camera Init Error:", error);
            alert("Could not access camera (Ensure HTTPS or localhost).");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !files.length) return;
        Array.from(files).forEach(f => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                new THREE.TextureLoader().load(ev.target?.result as string, (t) => {
                    t.colorSpace = THREE.SRGBColorSpace;
                    addPhotoToScene(t, sceneRef.current);
                });
            };
            reader.readAsDataURL(f);
        });
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#050d1a]">
            <div ref={containerRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

            <video
                ref={videoRef}
                className={`absolute bottom-20 left-5 w-[120px] h-[90px] object-cover scale-x-[-1] pointer-events-none z-50 border border-[#d4af37] transition-opacity duration-500 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
                autoPlay playsInline muted
            />

            <UIOverlay
                loading={loading}
                isCameraActive={isCameraActive}
                onModeChange={(mode) => handleSetMode(mode)}
                onCameraToggle={handleToggleCamera}
                onFileChange={handleFileChange}
            />
        </div>
    );
}

// --- 3. HELPER LOGIC FUNCTIONS ---

function processGestures(result: any, state: any) {
    if (result.landmarks && result.landmarks.length > 0) {
        state.hand.detected = true;
        const lm = result.landmarks[0];

        // Normalize coordinates (-1 to 1)
        state.hand.x = (lm[9].x - 0.5) * 2;
        state.hand.y = (lm[9].y - 0.5) * 2;

        const wrist = lm[0];
        const middleMCP = lm[9]; // Middle finger knuckle

        // Calculate hand size roughly
        const handSize = Math.hypot(middleMCP.x - wrist.x, middleMCP.y - wrist.y);
        if (handSize < 0.02) return;

        // Tips of fingers
        const tips = [lm[8], lm[12], lm[16], lm[20]];
        let avgTipDist = 0;
        tips.forEach(t => avgTipDist += Math.hypot(t.x - wrist.x, t.y - wrist.y));
        avgTipDist /= 4;

        // Pinch gesture (Thumb tip to Index tip)
        const pinchDist = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y);

        const extensionRatio = avgTipDist / handSize;
        const pinchRatio = pinchDist / handSize;

        // Logic switch modes
        if (extensionRatio < 1.5) {
            // Nắm tay lại -> Cây thu gọn
            state.mode = 'TREE';
            state.focusTarget = null;
        } else if (pinchRatio < 0.35) {
            // Chạm ngón trỏ cái (OK sign) -> Focus mode
            if (state.mode !== 'FOCUS') {
                state.mode = 'FOCUS';
                const photos = state.particleSystem.filter((p: Particle) => p.type === 'PHOTO');
                if (photos.length) state.focusTarget = photos[Math.floor(Math.random() * photos.length)].mesh;
            }
        } else if (extensionRatio > 1.7) {
            // Mở rộng bàn tay -> Bung cây (Scatter)
            state.mode = 'SCATTER';
            state.focusTarget = null;
        }
    } else {
        state.hand.detected = false;
    }
}

function addPhotoToScene(texture: THREE.Texture, state: any) {
    // 1. Tạo khung tranh
    const frameGeo = new THREE.BoxGeometry(1.4, 1.4, 0.05);
    const frameMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.champagneGold, metalness: 1.0, roughness: 0.1 });
    const frame = new THREE.Mesh(frameGeo, frameMat);

    // 2. Tính tỷ lệ ảnh
    let width = 1.2; let height = 1.2;
    if (texture.image) {
        const img = texture.image as HTMLImageElement;
        const aspect = (img.width || 1) / (img.height || 1);
        if (aspect > 1) height = width / aspect; else width = height * aspect;
    }

    // 3. Tạo Mesh ảnh
    const photoGeo = new THREE.PlaneGeometry(width, height);
    const photoMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const photo = new THREE.Mesh(photoGeo, photoMat);
    photo.position.z = 0.04; // Đẩy ra trước khung 1 chút

    // 4. Group lại
    const group = new THREE.Group();
    group.add(frame);
    group.add(photo);

    // Resize khung theo ảnh
    frame.scale.set(width / 1.2, height / 1.2, 1);

    // Scale tổng thể
    const s = 0.8;
    group.scale.set(s, s, s);

    // Add to main state groups
    state.photoMeshGroup.add(group);

    // 5. Tạo Particle mới cho ảnh này
    // Quan trọng: Phải dùng class Particle đã import
    const newParticle = new Particle(group, 'PHOTO', false, CONFIG);
    state.particleSystem.push(newParticle);

    // 6. Sắp xếp lại vị trí các ảnh trên cây
    updatePhotoLayout(state.particleSystem);
}

// Hàm sắp xếp ảnh xoắn ốc quanh cây
function updatePhotoLayout(particleSystem: Particle[]) {
    const photos = particleSystem.filter(p => p.type === 'PHOTO');
    const count = photos.length;
    if (count === 0) return;

    const h = CONFIG.particles.treeHeight * 0.9;
    const bottomY = -h / 2;
    const stepY = h / count;
    const loops = 3; // Số vòng xoắn

    photos.forEach((p, i) => {
        const y = bottomY + stepY * i + stepY / 2;
        const normalizedH = (y + h / 2) / CONFIG.particles.treeHeight;

        // Càng lên cao bán kính càng nhỏ
        const r = Math.max(1.0, CONFIG.particles.treeRadius * (1.0 - normalizedH)) + 3.0;

        const angle = normalizedH * Math.PI * 2 * loops + (Math.PI / 4);

        // Update vị trí Tree mode của Particle
        p.posTree.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
    });
}