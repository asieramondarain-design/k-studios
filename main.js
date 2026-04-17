import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

/* =========================
   ESCENA BASE
========================= */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("game")
});

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 2, 5);

/* =========================
   LUZ
========================= */
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

/* =========================
   BLOQUES
========================= */
const blocks = [];
const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshLambertMaterial({ color: 0x55aa55 });

const size = 10;

for (let x = -size; x < size; x++) {
  for (let z = -size; z < size; z++) {
    const block = new THREE.Mesh(geo, mat);
    block.position.set(x, 0, z);
    scene.add(block);
    blocks.push(block);
  }
}

/* =========================
   MOVIMIENTO FPS SIMPLE
========================= */
const keys = {};
let velocityY = 0;
let onGround = false;

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

/* CLICK PARA EMPEZAR */
document.body.addEventListener("click", () => {
  document.getElementById("ui").style.display = "none";
});

/* =========================
   LOOP
========================= */
function animate() {
  requestAnimationFrame(animate);

  const speed = 0.1;

  if (keys["w"]) camera.position.z -= speed;
  if (keys["s"]) camera.position.z += speed;
  if (keys["a"]) camera.position.x -= speed;
  if (keys["d"]) camera.position.x += speed;

  // salto simple
  if (keys[" "] && onGround) {
    velocityY = 0.2;
    onGround = false;
  }

  velocityY -= 0.01;
  camera.position.y += velocityY;

  if (camera.position.y < 2) {
    camera.position.y = 2;
    velocityY = 0;
    onGround = true;
  }

  renderer.render(scene, camera);
}

animate();

/* =========================
   RESIZE
========================= */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
