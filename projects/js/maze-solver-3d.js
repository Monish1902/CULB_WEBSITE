/* ==========================================================================
   3D Interactive Showcase - Maze Solver Micromouse
   ========================================================================== */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMazeSolver3D);
} else {
  initMazeSolver3D();
}

function initMazeSolver3D() {
  const container = document.getElementById('canvas-container');
  const canvas = document.getElementById('three-canvas');
  if (!container || !canvas) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFAF8F2);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 6, 8);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(4, 10, 6);
  scene.add(dirLight);

  // Maze Walls Grid
  const mazeGroup = new THREE.Group();
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x0D0D0D, roughness: 0.4 });

  const wallPositions = [
    { x: -3, z: 0, w: 0.2, d: 4 },
    { x: 3, z: 0, w: 0.2, d: 4 },
    { x: 0, z: -2, w: 6, d: 0.2 },
    { x: 0, z: 2, w: 4, d: 0.2 },
    { x: -1, z: 0, w: 0.2, d: 2 }
  ];

  wallPositions.forEach(w => {
    const wallGeo = new THREE.BoxGeometry(w.w, 1.2, w.d);
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(w.x, -0.4, w.z);
    mazeGroup.add(wallMesh);
  });
  scene.add(mazeGroup);

  // Floor Grid
  const floorGeo = new THREE.PlaneGeometry(10, 10);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xEAE7DC });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1;
  scene.add(floor);

  // Micromouse Bot
  const botGroup = new THREE.Group();
  const bodyGeo = new THREE.BoxGeometry(0.8, 0.3, 0.8);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2D5BFF });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  botGroup.add(body);

  // Front Distance Sensors
  const distGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const distMat = new THREE.MeshBasicMaterial({ color: 0x00FF66 });
  const sensorLeft = new THREE.Mesh(distGeo, distMat);
  sensorLeft.position.set(-0.3, 0, 0.42);
  botGroup.add(sensorLeft);

  const sensorRight = new THREE.Mesh(distGeo, distMat);
  sensorRight.position.set(0.3, 0, 0.42);
  botGroup.add(sensorRight);

  botGroup.position.set(-2, -0.85, 1);
  scene.add(botGroup);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: '#step-1',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => {
      gsap.to(botGroup.position, { z: -1, duration: 1.2 });
      gsap.to(botGroup.rotation, { y: Math.PI / 2, duration: 1.2 });
    },
    onEnterBack: () => {
      gsap.to(botGroup.position, { x: -2, z: 1, duration: 1.2 });
      gsap.to(botGroup.rotation, { y: 0, duration: 1.2 });
    }
  });

  ScrollTrigger.create({
    trigger: '#step-2',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => {
      gsap.to(botGroup.position, { x: 1.5, duration: 1.2 });
      gsap.to(botGroup.rotation, { y: 0, duration: 1.2 });
    },
    onEnterBack: () => {
      gsap.to(botGroup.position, { z: -1, duration: 1.2 });
      gsap.to(botGroup.rotation, { y: Math.PI / 2, duration: 1.2 });
    }
  });

  document.getElementById('btn-reset-view')?.addEventListener('click', () => {
    gsap.to(camera.position, { x: 0, y: 6, z: 8, duration: 1 });
  });

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
