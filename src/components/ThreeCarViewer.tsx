import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Eye, Sun, Sparkles, RefreshCw } from 'lucide-react';

interface ThreeCarViewerProps {
  initialColor?: string;
  carName?: string;
  variant?: string;
  year?: number;
}

const CAR_COLOR_PALETTE = [
  { name: 'Dravit Grey', hex: '#262d35', label: 'Metallic' },
  { name: 'Mineral White', hex: '#e8edf3', label: 'Pearl' },
  { name: 'Portimao Blue', hex: '#163b78', label: 'Metallic' },
  { name: 'Black Sapphire', hex: '#111417', label: 'Obsidian' },
  { name: 'Sunset Bronze', hex: '#994418', label: 'Lustre' },
  { name: 'Carconomy Neon', hex: '#a3e635', label: 'Special' },
];

export const ThreeCarViewer: React.FC<ThreeCarViewerProps> = ({
  initialColor = '#262d35',
  carName = 'BMW 3 Series',
  variant = '330i M Sport',
  year = 2025,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [lightsOn, setLightsOn] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);

  // References to three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const bodyMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const headlightsRef = useRef<THREE.SpotLight[]>([]);
  const headlightMeshesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c0e12);
    scene.fog = new THREE.FogExp2(0x0c0e12, 0.05);

    // 2. Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.8, 2.2, 5.2);
    camera.lookAt(0, 0.6, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Key studio overhead ceiling light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Cool fill light from front-left
    const fillLight = new THREE.DirectionalLight(0xd4e4ff, 1.2);
    fillLight.position.set(-6, 4, 3);
    scene.add(fillLight);

    // Warm rim light from rear
    const rimLight = new THREE.DirectionalLight(0xccff00, 0.9);
    rimLight.position.set(2, 4, -6);
    scene.add(rimLight);

    // Ground Studio Grid Platform
    const gridHelper = new THREE.GridHelper(16, 32, 0xccff00, 0x22262e);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Circular illuminated showroom platform
    const platformGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.08, 64);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x12151a,
      roughness: 0.25,
      metalness: 0.8,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.04;
    platform.receiveShadow = true;
    scene.add(platform);

    // Neon glowing perimeter ring
    const ringGeo = new THREE.RingGeometry(4.15, 4.25, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xccff00, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.005;
    scene.add(ring);

    // 5. Procedural Detailed Sports Sedan Assembly
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    bodyMaterialsRef.current = [];
    headlightsRef.current = [];
    headlightMeshesRef.current = [];

    const carColorObj = new THREE.Color(currentColor);

    // Car Body Material (Metallic Paint with clearcoat)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: carColorObj,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: wireframeMode,
    });
    bodyMaterialsRef.current.push(bodyMaterial);

    // Dark Carbon / Trim Material
    const trimMaterial = new THREE.MeshStandardMaterial({
      color: 0x181a1e,
      roughness: 0.4,
      metalness: 0.6,
      wireframe: wireframeMode,
    });

    // Glass Material
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x111620,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.72,
    });

    // Chrome / Mirror Material
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.95,
    });

    // Interior visible cabin
    const interiorMaterial = new THREE.MeshStandardMaterial({
      color: 0x241d18, // Cognac leather interior
      roughness: 0.8,
      metalness: 0.1,
    });

    // === CHASSIS BUILD ===
    // Lower Main Body (Length ~3.8, Width ~1.7, Height ~0.55)
    const lowerBodyGeo = new THREE.BoxGeometry(3.6, 0.48, 1.65);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMaterial);
    lowerBody.position.set(0, 0.48, 0);
    lowerBody.castShadow = true;
    lowerBody.receiveShadow = true;
    carGroup.add(lowerBody);

    // Aerodynamic Sculpted Front Hood (tapered forward)
    const hoodGeo = new THREE.BoxGeometry(1.2, 0.25, 1.58);
    const hood = new THREE.Mesh(hoodGeo, bodyMaterial);
    hood.position.set(1.15, 0.62, 0);
    hood.rotation.z = -0.07;
    hood.castShadow = true;
    carGroup.add(hood);

    // Front Bumper & M-Sport Air Dam
    const bumperGeo = new THREE.BoxGeometry(0.5, 0.35, 1.62);
    const bumper = new THREE.Mesh(bumperGeo, trimMaterial);
    bumper.position.set(1.75, 0.35, 0);
    bumper.castShadow = true;
    carGroup.add(bumper);

    // Kidney Grille Left & Right
    const grilleGeo = new THREE.BoxGeometry(0.06, 0.18, 0.28);
    const grilleL = new THREE.Mesh(grilleGeo, chromeMaterial);
    grilleL.position.set(1.82, 0.45, 0.18);
    const grilleR = new THREE.Mesh(grilleGeo, chromeMaterial);
    grilleR.position.set(1.82, 0.45, -0.18);
    carGroup.add(grilleL);
    carGroup.add(grilleR);

    // Cabin Greenhouse Roof & Pillars
    const cabinGeo = new THREE.BoxGeometry(1.9, 0.52, 1.35);
    const cabin = new THREE.Mesh(cabinGeo, bodyMaterial);
    cabin.position.set(-0.25, 0.92, 0);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Interior Seats
    const seatGeo = new THREE.BoxGeometry(0.4, 0.45, 0.38);
    const seatL = new THREE.Mesh(seatGeo, interiorMaterial);
    seatL.position.set(-0.15, 0.8, 0.35);
    const seatR = new THREE.Mesh(seatGeo, interiorMaterial);
    seatR.position.set(-0.15, 0.8, -0.35);
    carGroup.add(seatL);
    carGroup.add(seatR);

    // Windshield (front sloping)
    const windshieldGeo = new THREE.BoxGeometry(0.72, 0.42, 1.32);
    const windshield = new THREE.Mesh(windshieldGeo, glassMaterial);
    windshield.position.set(0.68, 0.85, 0);
    windshield.rotation.z = -0.58;
    carGroup.add(windshield);

    // Rear Windshield (rear sloping fastback)
    const rearGlassGeo = new THREE.BoxGeometry(0.68, 0.38, 1.28);
    const rearGlass = new THREE.Mesh(rearGlassGeo, glassMaterial);
    rearGlass.position.set(-1.18, 0.85, 0);
    rearGlass.rotation.z = 0.55;
    carGroup.add(rearGlass);

    // Side Windows Left & Right
    const sideGlassGeo = new THREE.BoxGeometry(1.55, 0.32, 0.05);
    const sideGlassL = new THREE.Mesh(sideGlassGeo, glassMaterial);
    sideGlassL.position.set(-0.25, 0.88, 0.67);
    const sideGlassR = new THREE.Mesh(sideGlassGeo, glassMaterial);
    sideGlassR.position.set(-0.25, 0.88, -0.67);
    carGroup.add(sideGlassL);
    carGroup.add(sideGlassR);

    // Rear Trunk Decklid & M Spoiler Lip
    const trunkGeo = new THREE.BoxGeometry(0.8, 0.22, 1.54);
    const trunk = new THREE.Mesh(trunkGeo, bodyMaterial);
    trunk.position.set(-1.5, 0.65, 0);
    trunk.castShadow = true;
    carGroup.add(trunk);

    const spoilerLipGeo = new THREE.BoxGeometry(0.08, 0.04, 1.48);
    const spoilerLip = new THREE.Mesh(spoilerLipGeo, trimMaterial);
    spoilerLip.position.set(-1.88, 0.77, 0);
    carGroup.add(spoilerLip);

    // Rear Diffuser & Twin Exhausts
    const diffuserGeo = new THREE.BoxGeometry(0.4, 0.22, 1.56);
    const diffuser = new THREE.Mesh(diffuserGeo, trimMaterial);
    diffuser.position.set(-1.75, 0.3, 0);
    carGroup.add(diffuser);

    const exhaustGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.15, 16);
    const exhaustL = new THREE.Mesh(exhaustGeo, chromeMaterial);
    exhaustL.rotation.z = Math.PI / 2;
    exhaustL.position.set(-1.92, 0.25, 0.45);
    const exhaustR = new THREE.Mesh(exhaustGeo, chromeMaterial);
    exhaustR.rotation.z = Math.PI / 2;
    exhaustR.position.set(-1.92, 0.25, -0.45);
    carGroup.add(exhaustL);
    carGroup.add(exhaustR);

    // Side Mirrors
    const mirrorGeo = new THREE.BoxGeometry(0.18, 0.1, 0.22);
    const mirrorL = new THREE.Mesh(mirrorGeo, trimMaterial);
    mirrorL.position.set(0.62, 0.84, 0.82);
    const mirrorR = new THREE.Mesh(mirrorGeo, trimMaterial);
    mirrorR.position.set(0.62, 0.84, -0.82);
    carGroup.add(mirrorL);
    carGroup.add(mirrorR);

    // LED Headlights Assembly
    const headlightGeo = new THREE.BoxGeometry(0.12, 0.09, 0.32);
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const headlightL = new THREE.Mesh(headlightGeo, headlightMat);
    headlightL.position.set(1.74, 0.52, 0.55);
    const headlightR = new THREE.Mesh(headlightGeo, headlightMat);
    headlightR.position.set(1.74, 0.52, -0.55);
    carGroup.add(headlightL);
    carGroup.add(headlightR);
    headlightMeshesRef.current.push(headlightL, headlightR);

    // L-Shaped LED Taillights
    const taillightGeo = new THREE.BoxGeometry(0.08, 0.08, 0.38);
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const taillightL = new THREE.Mesh(taillightGeo, taillightMat);
    taillightL.position.set(-1.82, 0.56, 0.52);
    const taillightR = new THREE.Mesh(taillightGeo, taillightMat);
    taillightR.position.set(-1.82, 0.56, -0.52);
    carGroup.add(taillightL);
    carGroup.add(taillightR);

    // Forward Spotlights (Simulating Projector beams)
    const spotL = new THREE.SpotLight(0xf8fafc, 2.5, 12, Math.PI / 6, 0.4);
    spotL.position.set(1.8, 0.52, 0.55);
    spotL.target.position.set(6, 0.2, 0.55);
    scene.add(spotL);
    scene.add(spotL.target);

    const spotR = new THREE.SpotLight(0xf8fafc, 2.5, 12, Math.PI / 6, 0.4);
    spotR.position.set(1.8, 0.52, -0.55);
    spotR.target.position.set(6, 0.2, -0.55);
    scene.add(spotR);
    scene.add(spotR.target);
    headlightsRef.current.push(spotL, spotR);

    // 4 Performance Wheels & Rims with Brake Calipers
    const wheelPositions = [
      { x: 1.15, z: 0.85 },  // Front Left
      { x: 1.15, z: -0.85 }, // Front Right
      { x: -1.15, z: 0.85 }, // Rear Left
      { x: -1.15, z: -0.85 },// Rear Right
    ];

    const tireGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.22, 28);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x181a1d, roughness: 0.85, metalness: 0.1 });
    const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.23, 16);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.2, metalness: 0.95 });
    const caliperGeo = new THREE.BoxGeometry(0.12, 0.16, 0.08);
    const caliperMat = new THREE.MeshBasicMaterial({ color: 0x2563eb }); // M Performance Blue Caliper

    wheelPositions.forEach((pos) => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(pos.x, 0.34, pos.z);

      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.x = Math.PI / 2;
      tire.castShadow = true;
      wheelAssembly.add(tire);

      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      wheelAssembly.add(rim);

      const caliper = new THREE.Mesh(caliperGeo, caliperMat);
      caliper.position.set(0, 0.12, pos.z > 0 ? 0.04 : -0.04);
      wheelAssembly.add(caliper);

      carGroup.add(wheelAssembly);
    });

    // Shadow plane under car
    const shadowGeo = new THREE.PlaneGeometry(3.8, 1.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.65,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    carGroup.add(shadow);

    scene.add(carGroup);

    // 6. User Orbit Controls (Drag to rotate)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !carGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      carGroupRef.current.rotation.y += deltaX * 0.008;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile / tablet
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !carGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      carGroupRef.current.rotation.y += deltaX * 0.009;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 7. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isAutoRotating && carGroupRef.current && !isDragging) {
        carGroupRef.current.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, []);

  // Update paint color dynamically
  useEffect(() => {
    bodyMaterialsRef.current.forEach((mat) => {
      mat.color.set(currentColor);
    });
  }, [currentColor]);

  // Update headlights toggle
  useEffect(() => {
    headlightsRef.current.forEach((spot) => {
      spot.intensity = lightsOn ? 2.5 : 0;
    });
    headlightMeshesRef.current.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.color.set(lightsOn ? 0xffffff : 0x475569);
    });
  }, [lightsOn]);

  // Update wireframe mode
  useEffect(() => {
    bodyMaterialsRef.current.forEach((mat) => {
      mat.wireframe = wireframeMode;
    });
  }, [wireframeMode]);

  // Zoom helpers
  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    const currentDist = cam.position.length();
    const newDist = THREE.MathUtils.clamp(currentDist + delta, 3.8, 9.5);
    cam.position.setLength(newDist);
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !carGroupRef.current) return;
    cameraRef.current.position.set(4.8, 2.2, 5.2);
    cameraRef.current.lookAt(0, 0.6, 0);
    carGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden border border-white/10 bg-[#0A0D12] select-none">
      {/* 3D Canvas Mount Point */}
      {webGlSupported ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-950">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-[#CCFF00] mb-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <p className="text-white font-medium">3D Configurator Studio</p>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm">
            High performance WebGL rendering preview for {carName} {variant}.
          </p>
        </div>
      )}

      {/* Top Left Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
            3D Garage Studio
          </span>
          <span className="text-[11px] text-zinc-400 font-mono-numbers">{year} Spec</span>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white tracking-tight mt-1">
          {carName} <span className="text-zinc-400 font-normal">{variant}</span>
        </h3>
      </div>

      {/* Top Right Controls Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Pause auto-rotation' : 'Start auto-rotation'}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            isAutoRotating ? 'bg-[#CCFF00]/20 text-[#CCFF00]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setLightsOn(!lightsOn)}
          title="Toggle LED Headlights"
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            lightsOn ? 'bg-amber-400/20 text-amber-300' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          title="Toggle Wireframe CAD Mode"
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            wireframeMode ? 'bg-[#CCFF00]/20 text-[#CCFF00]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-white/15 mx-0.5" />

        <button
          onClick={() => handleZoom(-0.8)}
          title="Zoom In"
          className="p-1.5 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => handleZoom(0.8)}
          title="Zoom Out"
          className="p-1.5 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleResetCamera}
          title="Reset View"
          className="p-1.5 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Center: Automotive Color Swatches */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 max-w-[90%] overflow-x-auto">
        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider hidden sm:inline mr-1">
          Paint:
        </span>
        {CAR_COLOR_PALETTE.map((color) => {
          const isSelected = currentColor === color.hex;
          return (
            <button
              key={color.hex}
              onClick={() => setCurrentColor(color.hex)}
              className={`group relative flex items-center justify-center w-6 h-6 rounded-full transition-all ${
                isSelected
                  ? 'ring-2 ring-[#CCFF00] scale-110'
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: color.hex }}
              title={`${color.name} (${color.label})`}
            >
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-black/70" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Right: Interactive Drag Hint */}
      <div className="absolute bottom-4 right-4 z-10 hidden md:flex items-center gap-1.5 text-[11px] text-zinc-500 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-sm pointer-events-none">
        <span>360° Drag & Zoom</span>
      </div>
    </div>
  );
};
