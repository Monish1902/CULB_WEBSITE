/* ==========================================================================
   3D Interactive Showcase - Autonomous Drone
   ========================================================================== */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDrone3D);
} else {
  initDrone3D();
}

function initDrone3D() {
  const container = document.getElementById('canvas-container');
  const canvas = document.getElementById('three-canvas');
  if (!container || !canvas) return;

  // 1. Scene, Camera, Renderer Setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFAF8F2);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 3, 10);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  // 2. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 10, 7);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const bluePointLight = new THREE.PointLight(0x2D5BFF, 1.5, 15);
  bluePointLight.position.set(0, -1, 2);
  scene.add(bluePointLight);

  // Grid Floor Helper
  const gridHelper = new THREE.GridHelper(20, 20, 0x2D5BFF, 0x0D0D0D);
  gridHelper.position.y = -3;
  scene.add(gridHelper);

  // 3. Drone Model Construction using Primitives
  const droneGroup = new THREE.Group();

  // Central Body
  const bodyGeo = new THREE.BoxGeometry(1.6, 0.4, 1.6);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0D0D0D, roughness: 0.3 });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  droneGroup.add(bodyMesh);

  // Top Cap Accent Plate
  const capGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16);
  const capMat = new THREE.MeshStandardMaterial({ color: 0x2D5BFF, roughness: 0.2 });
  const capMesh = new THREE.Mesh(capGeo, capMat);
  capMesh.position.y = 0.3;
  droneGroup.add(capMesh);

  // Spraying Tank Payload (Underneath)
  const tankGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
  const tankMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.1 });
  const tankMesh = new THREE.Mesh(tankGeo, tankMat);
  tankMesh.rotation.z = Math.PI / 2;
  tankMesh.position.y = -0.4;
  droneGroup.add(tankMesh);

  // 4 Carbon Arms & Rotor Assembly
  const rotorBlades = [];
  const armPositions = [
    { x: 1.8, z: 1.8 },
    { x: -1.8, z: 1.8 },
    { x: 1.8, z: -1.8 },
    { x: -1.8, z: -1.8 }
  ];

  armPositions.forEach((pos, idx) => {
    // Arm tube
    const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 12);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const armMesh = new THREE.Mesh(armGeo, armMat);
    armMesh.rotation.z = Math.PI / 2;
    armMesh.rotation.y = Math.atan2(pos.z, pos.x);
    armMesh.position.set(pos.x / 2, 0, pos.z / 2);
    droneGroup.add(armMesh);

    // Motor Pod
    const motorGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 16);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x2D5BFF });
    const motorMesh = new THREE.Mesh(motorGeo, motorMat);
    motorMesh.position.set(pos.x, 0.15, pos.z);
    droneGroup.add(motorMesh);

    // Rotor Blade (Thin Box)
    const bladeGeo = new THREE.BoxGeometry(2.0, 0.02, 0.2);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0D0D0D, transparent: true, opacity: 0.85 });
    const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
    bladeMesh.position.set(pos.x, 0.32, pos.z);
    droneGroup.add(bladeMesh);
    rotorBlades.push(bladeMesh);

    // Tip LED Light
    const ledGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const ledMat = new THREE.MeshBasicMaterial({ color: idx < 2 ? 0x00FF66 : 0xFF2D5B });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(pos.x, -0.1, pos.z);
    droneGroup.add(ledMesh);
  });

  droneGroup.position.y = 0;
  scene.add(droneGroup);

  // 4. Animation Loop
  let rotorSpeed = 0.3;
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Spin rotor blades
    rotorBlades.forEach(blade => {
      blade.rotation.y += rotorSpeed;
    });

    // Hover bobbing
    if (!gsap.isTweening(droneGroup.position)) {
      droneGroup.position.y = Math.sin(time * 2) * 0.15;
    }

    renderer.render(scene, camera);
  }
  animate();

  // 5. GSAP ScrollTrigger Integration
  gsap.registerPlugin(ScrollTrigger);

  // Step 1 -> Step 2
  ScrollTrigger.create({
    trigger: '#step-1',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => {
      gsap.to(droneGroup.rotation, { x: 0.4, z: -0.2, duration: 1.2, ease: 'power2.out' });
      gsap.to(camera.position, { x: 2, y: 4, z: 7, duration: 1.2 });
      rotorSpeed = 0.6;
      updateHudTelemetry('PULSATION: HIGH', '85% RPM');
    },
    onEnterBack: () => {
      gsap.to(droneGroup.rotation, { x: 0, z: 0, duration: 1.2, ease: 'power2.out' });
      gsap.to(camera.position, { x: 0, y: 3, z: 10, duration: 1.2 });
      rotorSpeed = 0.3;
      updateHudTelemetry('HOVERING', '40% RPM');
    }
  });

  // Step 2 -> Step 3
  ScrollTrigger.create({
    trigger: '#step-2',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => {
      gsap.to(droneGroup.rotation, { y: Math.PI, x: -0.2, z: 0, duration: 1.5, ease: 'power2.inOut' });
      gsap.to(camera.position, { x: 0, y: -1, z: 6, duration: 1.5 });
      updateHudTelemetry('SCANNING PAYLOAD', 'ROS2 ACTIVE');
    },
    onEnterBack: () => {
      gsap.to(droneGroup.rotation, { y: 0, x: 0.4, z: -0.2, duration: 1.5 });
      gsap.to(camera.position, { x: 2, y: 4, z: 7, duration: 1.5 });
      updateHudTelemetry('PULSATION: HIGH', '85% RPM');
    }
  });

  // Step 3 -> Step 4
  ScrollTrigger.create({
    trigger: '#step-3',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => {
      gsap.to(droneGroup.position, { y: 1.5, x: 1, duration: 1.2, ease: 'power2.out' });
      gsap.to(droneGroup.rotation, { x: 0.5, y: Math.PI * 1.5, z: 0.3, duration: 1.2 });
      gsap.to(camera.position, { x: -3, y: 5, z: 8, duration: 1.2 });
      updateHudTelemetry('FLIGHT MISSION', '100% THRUST');
    },
    onEnterBack: () => {
      gsap.to(droneGroup.position, { y: 0, x: 0, duration: 1.2 });
      gsap.to(droneGroup.rotation, { y: Math.PI, x: -0.2, z: 0, duration: 1.2 });
      gsap.to(camera.position, { x: 0, y: -1, z: 6, duration: 1.2 });
      updateHudTelemetry('SCANNING PAYLOAD', 'ROS2 ACTIVE');
    }
  });

  // 6. Camera HUD Button Listeners
  document.getElementById('btn-reset-view')?.addEventListener('click', () => {
    gsap.to(camera.position, { x: 0, y: 3, z: 10, duration: 1 });
    gsap.to(droneGroup.rotation, { x: 0, y: 0, z: 0, duration: 1 });
  });

  document.getElementById('btn-rotate-360')?.addEventListener('click', () => {
    gsap.to(droneGroup.rotation, { y: droneGroup.rotation.y + Math.PI * 2, duration: 2, ease: 'power2.inOut' });
  });

  document.getElementById('btn-top-view')?.addEventListener('click', () => {
    gsap.to(camera.position, { x: 0, y: 12, z: 0.1, duration: 1 });
  });

  function updateHudTelemetry(status, rpm) {
    const statusEl = document.getElementById('hud-status-val');
    const rpmEl = document.getElementById('hud-rpm-val');
    if (statusEl) statusEl.textContent = status;
    if (rpmEl) rpmEl.textContent = rpm;
  }

  // 7. Responsive Resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
