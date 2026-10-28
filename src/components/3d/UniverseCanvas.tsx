import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { DestinationId, SceneId } from '../../types';
import { DESTINATIONS } from '../../services/destinationRegistry';
import { soundEngine } from '../../services/soundEngine';

interface UniverseCanvasProps {
  scene: SceneId;
  activeDestination: DestinationId | null;
  onSelectLaptop: () => void;
  onSelectDestination: (dest: DestinationId) => void;
  onInspectDestination?: (dest: DestinationId | null) => void;
  reducedMotion: boolean;
}

export const UniverseCanvas: React.FC<UniverseCanvasProps> = ({
  scene,
  activeDestination,
  onSelectLaptop,
  onSelectDestination,
  onInspectDestination,
  reducedMotion
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    scene,
    activeDestination,
    reducedMotion,
    hoveredDest: null as DestinationId | null,
    isLaptopHovered: false,
    tunnelZ: 0,
    // Orbital rotation state for mouse/touch direct manipulation
    hubRotationY: 0,
    hubVelocityY: 0,
    isDragging: false,
    dragStartX: 0,
    lastDragX: 0
  });

  useEffect(() => {
    stateRef.current.scene = scene;
    stateRef.current.activeDestination = activeDestination;
    stateRef.current.reducedMotion = reducedMotion;
  }, [scene, activeDestination, reducedMotion]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Three.js instances
    const threeScene = new THREE.Scene();
    threeScene.fog = new THREE.FogExp2(0x101113, 0.007);

    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.25, 2.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Dynamic procedural screen canvas for laptop screen
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 320;
    const screenCtx = screenCanvas.getContext('2d')!;
    const screenTexture = new THREE.CanvasTexture(screenCanvas);

    // Official logo image for laptop screen
    const logoImg = new Image();
    logoImg.src = '/images/brand/logo.jpeg';
    let logoLoaded = false;
    logoImg.onload = () => {
      logoLoaded = true;
    };

    // ==========================================
    // 1. SCENE 01 & 02: PHYSICAL WORKSPACE & 3D LAPTOP
    // ==========================================
    const deskGroup = new THREE.Group();
    threeScene.add(deskGroup);

    // Sculptural monolithic desk surface (Warm Ivory & Titanium finish)
    const deskTopMat = new THREE.MeshStandardMaterial({
      color: 0x222429,
      roughness: 0.35,
      metalness: 0.4
    });
    const deskTopGeo = new THREE.BoxGeometry(2.6, 0.08, 1.3);
    const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
    deskGroup.add(deskTop);

    // Sculptural monolithic angled legs
    const legGeo = new THREE.BoxGeometry(0.12, 1.45, 1.26);
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x191A1D,
      roughness: 0.5,
      metalness: 0.3
    });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-1.24, -0.74, 0);
    deskGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(1.24, -0.74, 0);
    deskGroup.add(rightLeg);

    // Floor surface
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d0f,
      roughness: 0.75,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.48;
    deskGroup.add(floor);

    // Physical 3D Laptop Object
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 0.042, 0.1);
    deskGroup.add(laptopGroup);

    const anodizedMetal = new THREE.MeshStandardMaterial({
      color: 0x8a8e94,
      metalness: 0.88,
      roughness: 0.25
    });
    const darkChassis = new THREE.MeshStandardMaterial({
      color: 0x121316,
      metalness: 0.6,
      roughness: 0.55
    });

    // Laptop Base
    const baseGeo = new THREE.BoxGeometry(0.74, 0.016, 0.5);
    const laptopBase = new THREE.Mesh(baseGeo, anodizedMetal);
    laptopGroup.add(laptopBase);

    // Keyboard well & chiclet keys
    const kbGeo = new THREE.BoxGeometry(0.66, 0.002, 0.24);
    const keyboard = new THREE.Mesh(kbGeo, darkChassis);
    keyboard.position.set(0, 0.009, -0.06);
    laptopGroup.add(keyboard);

    // Glass trackpad
    const padGeo = new THREE.BoxGeometry(0.24, 0.001, 0.15);
    const trackpad = new THREE.Mesh(padGeo, anodizedMetal);
    trackpad.position.set(0, 0.009, 0.14);
    laptopGroup.add(trackpad);

    // Screen Hinge (tilted back at 105 degrees)
    const screenHinge = new THREE.Group();
    screenHinge.position.set(0, 0.012, -0.24);
    screenHinge.rotation.x = THREE.MathUtils.degToRad(-15);
    laptopGroup.add(screenHinge);

    const lidGeo = new THREE.BoxGeometry(0.74, 0.5, 0.012);
    const lid = new THREE.Mesh(lidGeo, anodizedMetal);
    lid.position.set(0, 0.25, 0);
    screenHinge.add(lid);

    // Illuminated screen portal surface
    const screenGeo = new THREE.PlaneGeometry(0.7, 0.46);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.25, 0.007);
    screenHinge.add(screenMesh);

    // Warm pool of light directly over desk
    const deskSpot = new THREE.SpotLight(0xfff3e0, 2.2, 5, Math.PI / 4, 0.5);
    deskSpot.position.set(0, 2.4, 0.8);
    deskSpot.target = laptopGroup;
    deskGroup.add(deskSpot);

    // ==========================================
    // 2. SCENE 03: HIGH-SPEED 3D DIMENSIONAL TUNNEL
    // ==========================================
    const tunnelGroup = new THREE.Group();
    tunnelGroup.position.set(0, 0, -20);
    threeScene.add(tunnelGroup);

    const ringCount = 32;
    const ringSpacing = 12;
    const ringMeshes: THREE.Mesh[] = [];

    const ringGeo = new THREE.TorusGeometry(3.8, 0.08, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x333740,
      metalness: 0.9,
      roughness: 0.2
    });
    const emberRingMat = new THREE.MeshBasicMaterial({ color: 0xff6a2a });
    const champagneRingMat = new THREE.MeshBasicMaterial({ color: 0xc8a879 });

    for (let i = 0; i < ringCount; i++) {
      let mat: THREE.Material = ringMat;
      if (i % 4 === 0) mat = emberRingMat;
      else if (i % 4 === 2) mat = champagneRingMat;

      const ring = new THREE.Mesh(ringGeo, mat);
      ring.position.z = -i * ringSpacing;
      tunnelGroup.add(ring);
      ringMeshes.push(ring);
    }

    // Glowing longitudinal speed guide rails
    const railGeo = new THREE.CylinderGeometry(0.04, 0.04, ringCount * ringSpacing, 8);
    railGeo.rotateX(Math.PI / 2);
    const emberRailMat = new THREE.MeshBasicMaterial({ color: 0xff6a2a });
    const ivoryRailMat = new THREE.MeshBasicMaterial({ color: 0xf4f0e8 });

    const railPositions = [
      [0, -3.7, -(ringCount * ringSpacing) / 2],
      [0, 3.7, -(ringCount * ringSpacing) / 2],
      [-3.7, 0, -(ringCount * ringSpacing) / 2],
      [3.7, 0, -(ringCount * ringSpacing) / 2]
    ];

    railPositions.forEach((pos, idx) => {
      const rail = new THREE.Mesh(railGeo, idx % 2 === 0 ? emberRailMat : ivoryRailMat);
      rail.position.set(pos[0], pos[1], pos[2]);
      tunnelGroup.add(rail);
    });

    // Warp Streaks / Velocity Particles
    const particleCount = 500;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.6 + Math.random() * 3.3;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = Math.sin(angle) * radius;
      particlePositions[i * 3 + 2] = -Math.random() * (ringCount * ringSpacing);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffa366,
      size: 0.1,
      transparent: true,
      opacity: 0.85
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    tunnelGroup.add(particles);

    // ==========================================
    // 3. SCENE 04: THE ORBITAL HUB & DIRECT MANIPULATION RING
    // ==========================================
    const hubGroup = new THREE.Group();
    hubGroup.position.set(0, 0, -420);
    threeScene.add(hubGroup);

    // Central Monolith Core (Forkframe "F" architectural sculpture)
    const nexusGroup = new THREE.Group();
    hubGroup.add(nexusGroup);

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x191a1d,
      metalness: 0.9,
      roughness: 0.15
    });
    const emberCoreMat = new THREE.MeshStandardMaterial({
      color: 0xff6a2a,
      emissive: 0xd9501a,
      emissiveIntensity: 0.7,
      metalness: 0.8,
      roughness: 0.2
    });
    const champagneCoreMat = new THREE.MeshStandardMaterial({
      color: 0xc8a879,
      metalness: 0.9,
      roughness: 0.3
    });

    const block1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.4, 0.35), frameMat);
    block1.position.set(-0.6, 0, 0);
    nexusGroup.add(block1);

    const block2 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.35, 0.35), emberCoreMat);
    block2.position.set(0, 1.02, 0);
    nexusGroup.add(block2);

    const block3 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.35), champagneCoreMat);
    block3.position.set(-0.2, 0.15, 0);
    nexusGroup.add(block3);

    // Glowing orbital track rings
    const hubRingGeo = new THREE.RingGeometry(5.4, 5.48, 64);
    const hubRingMat = new THREE.MeshBasicMaterial({
      color: 0xff6a2a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const hubFloorRing = new THREE.Mesh(hubRingGeo, hubRingMat);
    hubFloorRing.rotation.x = Math.PI / 2;
    hubFloorRing.position.y = -1.6;
    hubGroup.add(hubFloorRing);

    // Orbital Ring Parent Group (Rotated directly via mouse/touch drag!)
    const orbitalRingGroup = new THREE.Group();
    hubGroup.add(orbitalRingGroup);

    const stationRadius = 5.6;
    const stationMeshes: { id: DestinationId; mesh: THREE.Mesh; halo: THREE.Mesh }[] = [];

    DESTINATIONS.forEach((dest) => {
      const panelGroup = new THREE.Group();
      const x = Math.sin(dest.angle) * stationRadius;
      const z = Math.cos(dest.angle) * stationRadius;
      panelGroup.position.set(x, 0.2, z);
      panelGroup.lookAt(0, 0.2, 0);

      // Glass surface
      const panelGeo = new THREE.BoxGeometry(1.6, 1.0, 0.04);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x14161a,
        transparent: true,
        opacity: 0.88,
        roughness: 0.12,
        metalness: 0.3,
        reflectivity: 0.95
      });
      const panelMesh = new THREE.Mesh(panelGeo, glassMat);
      panelMesh.userData = { destinationId: dest.id };
      panelGroup.add(panelMesh);

      // Luminous border frame
      const frameOutlineGeo = new THREE.BoxGeometry(1.64, 1.04, 0.02);
      const edgeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(dest.themeColor),
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      const haloMesh = new THREE.Mesh(frameOutlineGeo, edgeMat);
      panelGroup.add(haloMesh);

      orbitalRingGroup.add(panelGroup);
      stationMeshes.push({ id: dest.id, mesh: panelMesh, halo: haloMesh });
    });

    // ==========================================
    // 4. LIGHTING SYSTEM
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.38);
    threeScene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    keyLight.position.set(4, 5, 3);
    threeScene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff6a2a, 1.1);
    rimLight.position.set(-4, 3, -2);
    threeScene.add(rimLight);

    // ==========================================
    // 5. INTERACTION, RAYCASTING & DIRECT DRAG TO ORBIT
    // ==========================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      stateRef.current.isDragging = true;
      stateRef.current.dragStartX = clientX;
      stateRef.current.lastDragX = clientX;
      stateRef.current.hubVelocityY = 0;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (stateRef.current.isDragging && stateRef.current.scene === 'HUB') {
        const deltaX = clientX - stateRef.current.lastDragX;
        stateRef.current.lastDragX = clientX;
        stateRef.current.hubRotationY += deltaX * 0.005;
        stateRef.current.hubVelocityY = deltaX * 0.005;
      }

      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      if (stateRef.current.scene === 'VOID') {
        const intersects = raycaster.intersectObjects([laptopBase, keyboard, trackpad, screenMesh], true);
        const wasHovered = stateRef.current.isLaptopHovered;
        stateRef.current.isLaptopHovered = intersects.length > 0;
        if (!wasHovered && stateRef.current.isLaptopHovered) {
          soundEngine.playHoverTone();
          container.style.cursor = 'pointer';
        } else if (wasHovered && !stateRef.current.isLaptopHovered) {
          container.style.cursor = 'default';
        }
      } else if (stateRef.current.scene === 'HUB' && !stateRef.current.isDragging) {
        const meshes = stationMeshes.map((s) => s.mesh);
        const intersects = raycaster.intersectObjects(meshes);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const destId = hit.userData.destinationId as DestinationId;
          if (stateRef.current.hoveredDest !== destId) {
            stateRef.current.hoveredDest = destId;
            soundEngine.playHoverTone();
            container.style.cursor = 'pointer';
            onInspectDestination?.(destId);
          }
        } else {
          if (stateRef.current.hoveredDest !== null) {
            stateRef.current.hoveredDest = null;
            container.style.cursor = 'default';
            if (typeof window !== 'undefined' && !('ontouchstart' in window)) {
              onInspectDestination?.(null);
            }
          }
        }
      }
    };

    const handlePointerUp = (e: MouseEvent | TouchEvent) => {
      const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
      const dragDist = Math.abs(clientX - stateRef.current.dragStartX);

      stateRef.current.isDragging = false;

      // If user barely dragged, treat as click/selection
      if (dragDist < 8) {
        if (stateRef.current.scene === 'VOID') {
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects([laptopBase, keyboard, trackpad, screenMesh], true);
          if (intersects.length > 0) {
            onSelectLaptop();
          }
        } else if (stateRef.current.scene === 'HUB') {
          // Check what was clicked / tapped
          raycaster.setFromCamera(mouse, camera);
          const meshes = stationMeshes.map((s) => s.mesh);
          const intersects = raycaster.intersectObjects(meshes);
          if (intersects.length > 0) {
            const hit = intersects[0].object;
            const destId = hit.userData.destinationId as DestinationId;
            stateRef.current.hoveredDest = destId;
            soundEngine.playHoverTone();
            onInspectDestination?.(destId);
          } else if (stateRef.current.hoveredDest) {
            onInspectDestination?.(stateRef.current.hoveredDest);
          }
        }
      }
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // ==========================================
    // 6. ANIMATION & RENDER LOOP
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let vortexAngle = 0;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Screen vortex texture animation
      vortexAngle += delta * 2;
      screenCtx.fillStyle = '#0f1013';
      screenCtx.fillRect(0, 0, 512, 320);

      const cx = 256;
      const cy = 160;
      for (let r = 120; r > 10; r -= 15) {
        screenCtx.beginPath();
        screenCtx.arc(cx, cy, r, 0, Math.PI * 2);
        screenCtx.strokeStyle = `rgba(255, 106, 42, ${0.35 + Math.sin(vortexAngle + r * 0.1) * 0.25})`;
        screenCtx.lineWidth = 3;
        screenCtx.stroke();
      }

      screenCtx.fillStyle = '#ffffff';
      screenCtx.font = 'bold 16px "Outfit", sans-serif';
      screenCtx.textAlign = 'center';

      // Draw official logo image when loaded
      if (logoLoaded && logoImg.complete) {
        try {
          const logoSize = 100;
          screenCtx.save();
          // Subtle circular frame
          screenCtx.beginPath();
          screenCtx.arc(cx, cy - 15, logoSize / 2, 0, Math.PI * 2);
          screenCtx.fillStyle = '#101113';
          screenCtx.fill();
          screenCtx.clip();
          screenCtx.drawImage(logoImg, cx - logoSize / 2, cy - 15 - logoSize / 2, logoSize, logoSize);
          screenCtx.restore();

          // Border ring around logo
          screenCtx.beginPath();
          screenCtx.arc(cx, cy - 15, logoSize / 2 + 2, 0, Math.PI * 2);
          screenCtx.strokeStyle = '#FF6A2A';
          screenCtx.lineWidth = 2;
          screenCtx.stroke();
        } catch (e) {
          // ignore drawImage errors
        }
      }

      screenCtx.fillStyle = '#F4F0E8';
      screenCtx.fillText('FORKFRAME STUDIO', cx, 260);
      screenCtx.font = '11px monospace';
      screenCtx.fillStyle = '#FF6A2A';
      screenCtx.fillText('STEP INSIDE · CLICK TO ENTER', cx, 282);
      screenTexture.needsUpdate = true;

      const curScene = stateRef.current.scene;

      if (curScene === 'VOID') {
        deskGroup.visible = true;
        tunnelGroup.visible = false;
        hubGroup.visible = false;

        camera.position.x = Math.sin(elapsed * 0.4) * 0.08;
        camera.position.y = 1.25 + Math.cos(elapsed * 0.5) * 0.04;
        camera.position.z = 2.8;
        camera.lookAt(0, 0.42, 0);

        laptopGroup.position.y = stateRef.current.isLaptopHovered
          ? 0.042 + Math.sin(elapsed * 6) * 0.012
          : 0.042;
      } else if (curScene === 'LAPTOP_ACTIVE') {
        deskGroup.visible = true;
        tunnelGroup.visible = false;
        hubGroup.visible = false;

        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 0.18, delta * 3.6);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.46, delta * 3.6);
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, delta * 3.6);
        camera.lookAt(0, 0.36, 0);
      } else if (curScene === 'TUNNEL') {
        deskGroup.visible = false;
        tunnelGroup.visible = true;
        hubGroup.visible = true;

        const warpSpeed = stateRef.current.reducedMotion ? 40 : 130;
        stateRef.current.tunnelZ -= delta * warpSpeed;

        camera.position.set(
          Math.sin(elapsed * 3) * (stateRef.current.reducedMotion ? 0.04 : 0.2),
          Math.cos(elapsed * 4) * (stateRef.current.reducedMotion ? 0.04 : 0.2),
          stateRef.current.tunnelZ
        );
        camera.lookAt(0, 0, stateRef.current.tunnelZ - 30);

        const positions = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 2] += delta * 90;
          if (positions[i * 3 + 2] > 5) {
            positions[i * 3 + 2] = -(ringCount * ringSpacing);
          }
        }
        particleGeo.attributes.position.needsUpdate = true;

        ringMeshes.forEach((ring, idx) => {
          ring.rotation.z += (idx % 2 === 0 ? 0.35 : -0.35) * delta;
        });
      } else if (curScene === 'HUB' || curScene === 'TERMINAL') {
        deskGroup.visible = false;
        tunnelGroup.visible = false;
        hubGroup.visible = true;

        // Inertial orbital ring damping
        if (!stateRef.current.isDragging) {
          stateRef.current.hubRotationY += stateRef.current.hubVelocityY;
          stateRef.current.hubVelocityY *= 0.94;
          // Gentle autonomous idle orbit
          stateRef.current.hubRotationY += delta * 0.08;
        }

        orbitalRingGroup.rotation.y = stateRef.current.hubRotationY;

        // Central nexus slow rotation
        nexusGroup.rotation.y += delta * 0.25;
        nexusGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.07;

        if (curScene === 'HUB') {
          camera.position.set(0, 0.85, -414);
          camera.lookAt(0, 0.45, -420);
        } else {
          camera.position.set(Math.sin(elapsed * 0.2) * 0.35, 0.65, -415);
          camera.lookAt(0, 0.35, -420);
        }

        stationMeshes.forEach(({ id, mesh, halo }) => {
          const isHovered = stateRef.current.hoveredDest === id;
          if (isHovered) {
            (halo.material as THREE.MeshBasicMaterial).opacity = 0.95;
            halo.scale.set(1.1, 1.1, 1.1);
            mesh.position.y = 0.06;
          } else {
            (halo.material as THREE.MeshBasicMaterial).opacity = 0.4;
            halo.scale.set(1, 1, 1);
            mesh.position.y = 0;
          }
        });
      }

      renderer.render(threeScene, camera);
    };

    render();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-auto"
      style={{ touchAction: 'none' }}
    />
  );
};
