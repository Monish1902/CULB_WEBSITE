/* ==========================================================================
   3D Interactive Showcase - Line-Following Bot
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLineFollowing3D();
});

function initLineFollowing3D() {
  const container = document.getElementById('canvas-container');
  const canvas = document.getElementById('three-canvas');
  if (!container || !canvas) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFAF8F2);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 4, 8);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);

  // Curved Black & Blue Track Line on Floor
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4, -0.98, -4),
    new THREE.Vector3(-1, -0.98, -1),
    new THREE.Vector3(2, -0.98, -3),
    new THREE.Vector3(3, -0.98, 1),
    new THREE.Vector3(0, -0.98, 3),
    new THREE.Vector3(-3, -0.98, 1),
    new THREE.Vector3(-4, -0.98, -4)
  ]);
  const points = curve.getPoints(100);
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x2D5BFF, linewidth: 5 });
  const lineMesh = new THREE.Line(lineGeo, lineMat);
  scene.add(lineMesh);

  // Floor
  const floorGeo = new THREE.PlaneGeometry(20, 20);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xEAE7DC, roughness: 0.8 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1;
  scene.add(floor);

  // Bot Model Construction
  const botGroup = new THREE.Group();

  // Chassis
  const chassisGeo = new THREE.BoxGeometry(1.2, 0.25, 1.8);
  const chassisMat = new THREE.MeshStandardMaterial({ color: 0x0D0D0D, roughness: 0.3 });
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  botGroup.add(chassis);

  // Wheels (Left & Right)
  const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.15, 24);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x2D5BFF, roughness: 0.2 });
  
  const leftWheel = new THREE.Mesh(wheelGeo, wheelMat);
  leftWheel.rotation.z = Math.PI / 2;
  leftWheel.position.set(-0.7, 0, 0.3);
  botGroup.add(leftWheel);

  const rightWheel = new THREE.Mesh(wheelGeo, wheelMat);
  rightWheel.rotation.z = Math.PI / 2;
  rightWheel.position.set(0.7, 0, 0.3);
  botGroup.add(rightWheel);

  // Front IR Sensor Array Bar
  const sensorGeo = new THREE.BoxGeometry(1.0, 0.1, 0.2);
  const sensorMat = new THREE.MeshStandardMaterial({ color: 0xFF2D5B });
  const sensorBar = new THREE.Mesh(sensorGeo, sensorMat);
  sensorBar.position.set(0, -0.05, 0.95);
  botGroup.add(sensorBar);

  // Battery Pack
  const batGeo = new THREE.BoxGeometry(0.6, 0.3, 0.8);
  const batMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
  const bat = new THREE.Mesh(batGeo, batMat);
  bat.position.set(0, 0.25, -0.2);
  botGroup.add(bat);

  botGroup.position.y = -0.65;
  scene.add(botGroup);

  // Render & ScrollTrigger
  let progress = 0;
  function animate() {
    requestAnimationFrame(animate);

    // Roll wheels
    leftWheel.rotation.x += 0.05;
    rightWheel.rotation.x += 0.05;

    renderer.render(scene, camera);
  }
  animate();

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: '#step-1',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => {
      gsap.to(botGroup.position, { x: 2, z: -3, duration: 1.5 });
      gsap.to(botGroup.rotation, { y: Math.PI / 4, duration: 1.5 });
    },
    onEnterBack: () => {
      gsap.to(botGroup.position, { x: 0, z: 0, duration: 1.5 });
      gsap.to(botGroup.rotation, { y: 0, duration: 1.5 });
    }
  });

  ScrollTrigger.create({
    trigger: '#step-2',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => {
      gsap.to(botGroup.position, { x: 0, z: 3, duration: 1.5 });
      gsap.to(botGroup.rotation, { y: Math.PI, duration: 1.5 });
    },
    onEnterBack: () => {
      gsap.to(botGroup.position, { x: 2, z: -3, duration: 1.5 });
      gsap.to(botGroup.rotation, { y: Math.PI / 4, duration: 1.5 });
    }
  });

  // Buttons
  document.getElementById('btn-reset-view')?.addEventListener('click', () => {
    gsap.to(camera.position, { x: 0, y: 4, z: 8, duration: 1 });
  });
  document.getElementById('btn-top-view')?.addEventListener('click', () => {
    gsap.to(camera.position, { x: 0, y: 10, z: 0.1, duration: 1 });
  });

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
