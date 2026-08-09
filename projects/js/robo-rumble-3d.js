/* ==========================================================================
   3D Interactive Showcase - Robo Rumble Combat Bot
   ========================================================================== */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRoboRumble3D);
} else {
  initRoboRumble3D();
}

function initRoboRumble3D() {
  const container = document.getElementById('canvas-container');
  const canvas = document.getElementById('three-canvas');
  if (!container || !canvas) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFAF8F2);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 3, 7);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);

  const redSpot = new THREE.SpotLight(0xFF2D5B, 2);
  redSpot.position.set(0, 5, 2);
  scene.add(redSpot);

  // Bot Group
  const botGroup = new THREE.Group();

  // Wedge Armor Hull
  const hullGeo = new THREE.BoxGeometry(2.2, 0.6, 2.0);
  const hullMat = new THREE.MeshStandardMaterial({ color: 0x0D0D0D, metalness: 0.8, roughness: 0.2 });
  const hull = new THREE.Mesh(hullGeo, hullMat);
  botGroup.add(hull);

  // Vertical Spinner Blade (Disc)
  const bladeGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.12, 24);
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0x2D5BFF, metalness: 0.9, roughness: 0.1 });
  const blade = new THREE.Mesh(bladeGeo, bladeMat);
  blade.rotation.z = Math.PI / 2;
  blade.position.set(0, 0.1, 1.1);
  botGroup.add(blade);

  // Side Wheel Armor Guards
  const guardGeo = new THREE.BoxGeometry(0.3, 0.7, 2.2);
  const guardMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

  const leftGuard = new THREE.Mesh(guardGeo, guardMat);
  leftGuard.position.set(-1.2, 0, 0);
  botGroup.add(leftGuard);

  const rightGuard = new THREE.Mesh(guardGeo, guardMat);
  rightGuard.position.set(1.2, 0, 0);
  botGroup.add(rightGuard);

  botGroup.position.y = -0.5;
  scene.add(botGroup);

  let bladeRPM = 0.2;

  function animate() {
    requestAnimationFrame(animate);
    blade.rotation.x += bladeRPM;
    renderer.render(scene, camera);
  }
  animate();

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: '#step-1',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => {
      bladeRPM = 0.8;
      gsap.to(botGroup.rotation, { x: 0.2, y: Math.PI / 3, duration: 1 });
      gsap.to(camera.position, { x: 2, y: 2, z: 5, duration: 1 });
    },
    onEnterBack: () => {
      bladeRPM = 0.2;
      gsap.to(botGroup.rotation, { x: 0, y: 0, duration: 1 });
      gsap.to(camera.position, { x: 0, y: 3, z: 7, duration: 1 });
    }
  });

  ScrollTrigger.create({
    trigger: '#step-2',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => {
      bladeRPM = 1.5;
      gsap.to(botGroup.rotation, { y: Math.PI * 1.2, duration: 1.2 });
    },
    onEnterBack: () => {
      bladeRPM = 0.8;
      gsap.to(botGroup.rotation, { y: Math.PI / 3, duration: 1.2 });
    }
  });

  document.getElementById('btn-reset-view')?.addEventListener('click', () => {
    gsap.to(camera.position, { x: 0, y: 3, z: 7, duration: 1 });
    gsap.to(botGroup.rotation, { x: 0, y: 0, z: 0, duration: 1 });
  });

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
