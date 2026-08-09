/* ==========================================================================
   3D Interactive Showcase - Aqua Boat USV
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAquaBoat3D();
});

function initAquaBoat3D() {
  const container = document.getElementById('canvas-container');
  const canvas = document.getElementById('three-canvas');
  if (!container || !canvas) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF0F4F8);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 4, 8);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  // Animated Water Plane
  const waterGeo = new THREE.PlaneGeometry(25, 25, 32, 32);
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x2D5BFF, roughness: 0.1, transparent: true, opacity: 0.85 });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = -1;
  scene.add(water);

  // Catamaran Boat Group
  const boatGroup = new THREE.Group();

  // Pontoon 1 (Left)
  const pontoonGeo = new THREE.CylinderGeometry(0.3, 0.3, 3.2, 16);
  const pontoonMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
  
  const leftPontoon = new THREE.Mesh(pontoonGeo, pontoonMat);
  leftPontoon.rotation.x = Math.PI / 2;
  leftPontoon.position.set(-1.0, 0, 0);
  boatGroup.add(leftPontoon);

  // Pontoon 2 (Right)
  const rightPontoon = new THREE.Mesh(pontoonGeo, pontoonMat);
  rightPontoon.rotation.x = Math.PI / 2;
  rightPontoon.position.set(1.0, 0, 0);
  boatGroup.add(rightPontoon);

  // Cross Deck Platform
  const deckGeo = new THREE.BoxGeometry(2.2, 0.15, 2.0);
  const deckMat = new THREE.MeshStandardMaterial({ color: 0x0D0D0D });
  const deck = new THREE.Mesh(deckGeo, deckMat);
  deck.position.set(0, 0.2, 0);
  boatGroup.add(deck);

  // Telemetry Mast
  const mastGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 8);
  const mastMat = new THREE.MeshStandardMaterial({ color: 0xFF2D5B });
  const mast = new THREE.Mesh(mastGeo, mastMat);
  mast.position.set(0, 0.9, -0.4);
  boatGroup.add(mast);

  boatGroup.position.y = -0.8;
  scene.add(boatGroup);

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Wave Displacement
    const pos = waterGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const z = Math.sin(u * 0.8 + time * 2) * 0.1 + Math.cos(v * 0.8 + time * 1.5) * 0.1;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;

    // Boat pitch and roll
    boatGroup.position.y = -0.8 + Math.sin(time * 2) * 0.05;
    boatGroup.rotation.z = Math.sin(time * 1.5) * 0.03;

    renderer.render(scene, camera);
  }
  animate();

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: '#step-1',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => {
      gsap.to(boatGroup.rotation, { y: Math.PI / 2, duration: 1.5 });
      gsap.to(boatGroup.position, { x: 2, duration: 1.5 });
    },
    onEnterBack: () => {
      gsap.to(boatGroup.rotation, { y: 0, duration: 1.5 });
      gsap.to(boatGroup.position, { x: 0, duration: 1.5 });
    }
  });

  document.getElementById('btn-reset-view')?.addEventListener('click', () => {
    gsap.to(camera.position, { x: 0, y: 4, z: 8, duration: 1 });
  });

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
