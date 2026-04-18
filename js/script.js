let scene, camera, renderer;
let stars = [];
let flowers = [];
let couple;

let mouseX = 0;

/* 🚀 INICIO */
document.getElementById("startScreen").onclick = () => {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("content").style.display = "block";

  init();
  animate();
};

function init() {
  scene = new THREE.Scene();

  const light = new THREE.PointLight(0xffd700, 1.5, 100);
  light.position.set(2, 2, 5);
  scene.add(light);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.z = 5.2;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  /* 🖱️ MOUSE PC */
  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    createSpark(e.clientX, e.clientY);
  });

  /* 📱 MOUSE MÓVIL */
  document.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    mouseX = (t.clientX / window.innerWidth - 0.5) * 2;
    createSpark(t.clientX, t.clientY);
  });

  createStars();
  createCouple();
  createFlowerRain();

  setTimeout(startStory, 1500);
}

/* 🌌 ESTRELLAS */
function createStars() {
  for (let i = 0; i < 300; i++) {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.015),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    star.position.set(
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15
    );

    scene.add(star);
    stars.push(star);
  }
}

/* 💞 PAREJA */
function createCouple() {
  const loader = new THREE.TextureLoader();

  loader.load("./assets/juntos.png?v=1", (texture) => {
    couple = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: texture, transparent: true })
    );

    const aspect = texture.image.width / texture.image.height;
    couple.scale.set(3.4 * aspect, 3.4, 1);

    scene.add(couple);
  });
}

/* 🌼 FLORES */
function createFlowerRain() {
  const loader = new THREE.TextureLoader();
  const tex = loader.load("./assets/flor.png?v=1");

  for (let i = 0; i < 120; i++) {
    const f = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true })
    );

    resetFlower(f);

    const size = 0.15 + Math.random() * 0.2;
    f.scale.set(size, size, 1);

    scene.add(f);
    flowers.push(f);
  }
}

function resetFlower(f) {
  f.position.x = (Math.random() - 0.5) * 10;
  f.position.y = -5 - Math.random() * 5;
  f.position.z = Math.random() * 2;

  f.userData.speed = 0.004 + Math.random() * 0.008;
  f.userData.sway = Math.random() * 2;
}

/* 💬 HISTORIA */
function startStory() {
  const frases = [
    "Esto lo hice pensando en ti 💛",
    "Hola…",
    "No sabía cómo decirte esto…",
    "Pero quería hacer algo diferente…",
    "Algo que te hiciera sonreír…",
    "Porque tú haces eso conmigo…",
    "Y no dejo de pensarte…"
  ];

  let i = 0;

  function mostrar() {
    if (i >= frases.length) return;

    const div = document.createElement("div");
    div.innerText = frases[i];

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    let x = cx;
    let y;

    if (i === 0) {
      y = cy + 200;
      div.style.color = "#ffd700";
      div.style.fontSize = "24px";
    } else {
      y = cy - 200 + i * 45;
      div.style.color = "white";
      div.style.fontSize = "18px";
    }

    div.style.position = "absolute";
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.style.transform = "translate(-50%, -50%)";

    div.style.opacity = "0";
    div.style.transition = "opacity 1.2s";
    div.style.textShadow = "0 0 10px rgba(0,0,0,0.9)";
    div.style.pointerEvents = "none";

    document.body.appendChild(div);

    setTimeout(() => (div.style.opacity = "1"), 120);

    i++;
    setTimeout(mostrar, 2200);
  }

  mostrar();
}

/* ✨ BRILLO MOUSE ARREGLADO */
function createSpark(x, y) {
  const spark = document.createElement("div");

  spark.style.position = "absolute";
  spark.style.left = x + "px";
  spark.style.top = y + "px";

  spark.style.width = "16px";
  spark.style.height = "16px";

  spark.style.background =
    "radial-gradient(circle, #fff6a0, #ffd700, transparent)";

  spark.style.borderRadius = "50%";
  spark.style.pointerEvents = "none";

  spark.style.boxShadow =
    "0 0 25px gold, 0 0 40px rgba(255,215,0,0.6)";

  spark.style.opacity = "1";
  spark.style.transition = "all 0.8s ease-out";

  document.body.appendChild(spark);

  requestAnimationFrame(() => {
    spark.style.opacity = "0";
    spark.style.transform = "scale(2.8)";
  });

  setTimeout(() => spark.remove(), 900);
}

/* 🎥 ANIMACIÓN */
function animate() {
  requestAnimationFrame(animate);

  let t = Date.now() * 0.001;

  stars.forEach(s => {
    s.position.z += 0.008;
    if (s.position.z > 5) s.position.z = -5;
  });

  flowers.forEach(f => {
    f.position.y += f.userData.speed;
    f.position.x += Math.sin(t + f.userData.sway) * 0.002;

    if (f.position.y > 5) resetFlower(f);
  });

  if (couple) {
    couple.position.y = Math.sin(t) * 0.05;
    couple.position.x += (mouseX * 0.25 - couple.position.x) * 0.05;
  }

  renderer.render(scene, camera);
}