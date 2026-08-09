/* ==========================================================================
   3D Interactive Showcase - Robo Soccer Bot
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initRoboSoccer3D();
});

function initRoboSoccer3D() {
  const container = document.getElementById('canvas-container');
  const canvas = document.getElementById('three-canvas');
  if (!container || !canvas) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFAF8F2);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 5, 8);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  // Bot Group
  const botGroup = new THREE.Group();

  // Cylindrical Body
  const bodyGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.6, 24);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2D5BFF, roughness: 0.3 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  botGroup.add(body);

  // Pneumatic Kicker Piston
  const pistonGeo = new THREE.BoxGeometry(0.4, 0.2, 0.6);
  const pistonMat = new THREE.MeshStandardMaterial({ color: 0x0D0D0D });
  const piston = new THREE.Mesh(pistonGeo, pistonMat);
  piston.position.set(0, -0.1, 0.8);
  botGroup.add(piston);

  botGroup.position.set(0, -0.5, 0);
  scene.add(botGroup);

  // Soccer Ball
  const ballGeo = new THREE.SphereGeometry(0.35, 16, 16);
  const ballMat = new THREE.MeshStandardMaterial({ color: 0xFF2D5B, roughness: 0.1 });
  const ball = new THREE.Mesh(ballGeo, ballMat);
  ball.position.set(0, -0.65, 1.5);
  scene.add(ball);

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
      // Dribble & kick ball
      gsap.to(piston.position, { z: 1.1, duration: 0.15, yoyo: true, repeat: 1 });
      gsap.to(ball.position, { z: 4.5, duration: 0.8, ease: 'power2.out' });
    },
    onEnterBack: () => {
      gsap.to(ball.position, { z: 1.5, duration: 0.8 });
    }
  });

  document.getElementById('btn-reset-view')?.addEventListener('click', () => {
    gsap.to(camera.position, { x: 0, y: 5, z: 8, duration: 1 });
  });

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
