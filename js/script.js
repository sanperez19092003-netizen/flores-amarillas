let scene, camera, renderer, stars = [];

document.getElementById("startScreen").onclick = () => {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("content").style.display = "block";
  init();
  animate();
};

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 🔥 IMPORTANTE (esto arregla que no se vea)
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0";

  document.body.appendChild(renderer.domElement);

  crearEstrellas();
}

function crearEstrellas() {
  for (let i = 0; i < 500; i++) {
    let geometry = new THREE.SphereGeometry(0.02);
    let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let estrella = new THREE.Mesh(geometry, material);

    estrella.position.x = (Math.random() - 0.5) * 20;
    estrella.position.y = (Math.random() - 0.5) * 20;
    estrella.position.z = (Math.random() - 0.5) * 20;

    scene.add(estrella);
    stars.push(estrella);
  }
}

function animate() {
  requestAnimationFrame(animate);

  // ✨ movimiento de estrellas (esto le da vida)
  stars.forEach((star) => {
    star.position.z += 0.05;

    if (star.position.z > 5) {
      star.position.z = -5;
    }
  });

  renderer.render(scene, camera);
}