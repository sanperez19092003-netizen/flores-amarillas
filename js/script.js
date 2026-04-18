let scene, camera, renderer;
let stars = [];
let flowers = [];
let pareja;
let textos = [];

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

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    createSpark(e.clientX, e.clientY);
  });

  createStars();
  createCouple();
  createFlowerRain();

  setTimeout(startStory, 1500);
}

/* 🌌 ESTRELLAS */
function createStars() {
  for (let i = 0; i < 300; i++) {
    let star = new THREE.Mesh(
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

  loader.load("./assets/juntos.png", (texture) => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    pareja = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: texture, transparent: true })
    );

    const aspect = texture.image.width / texture.image.height;
    const h = 3.8;
    const w = h * aspect;

    pareja.scale.set(w, h, 1);
    scene.add(pareja);
  });
}

/* 🌼 FLORES */
function createFlowerRain() {
  const loader = new THREE.TextureLoader();

  const tex = loader.load("./assets/flor.png");
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;

  for (let i = 0; i < 120; i++) {
    let f = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true })
    );

    resetFlower(f);

    let size = 0.15 + Math.random() * 0.2;
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

    let div = document.createElement("div");
    div.innerText = frases[i];

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;

    let radiusX = 320;
    let radiusY = 200;

    let angle = (i / frases.length) * Math.PI * 2;

    let x = cx + Math.cos(angle) * radiusX;
    let y = cy + Math.sin(angle) * radiusY;

    if (i === 0) {
      x = cx;
      y = cy + 180;
      div.style.color = "#ffd700";
      div.style.fontSize = "22px";
    }

    div.style.position = "absolute";
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.style.transform = "translate(-50%, -50%)";

    div.style.color = i === 0 ? "#ffd700" : "white";
    div.style.fontSize = i === 0 ? "22px" : "18px";
    div.style.opacity = "0";
    div.style.transition = "opacity 1s";
    div.style.textShadow = "0 0 10px rgba(0,0,0,0.9)";
    div.style.pointerEvents = "auto";

    document.body.appendChild(div);

    makeDraggable(div, "frase_" + i);

    setTimeout(() => {
      div.style.opacity = "1";
    }, 100);

    textos.push(div);

    i++;
    setTimeout(mostrar, 2200);
  }

  mostrar();
}

/* 💾 DRAG + GUARDADO */
function makeDraggable(div, id) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  div.style.cursor = "grab";
  div.style.userSelect = "none";
  div.style.zIndex = 9999;

  const saved = localStorage.getItem(id);
  if (saved) {
    const pos = JSON.parse(saved);
    div.style.left = pos.x + "px";
    div.style.top = pos.y + "px";
  }

  div.addEventListener("mousedown", (e) => {
    isDragging = true;

    const rect = div.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    div.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    div.style.left = x + "px";
    div.style.top = y + "px";

    localStorage.setItem(id, JSON.stringify({ x, y }));
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    div.style.cursor = "grab";
  });
}

/* ✨ MOUSE SPARK */
function createSpark(x, y) {
  let spark = document.createElement("div");

  spark.style.position = "absolute";
  spark.style.left = x + "px";
  spark.style.top = y + "px";
  spark.style.width = "6px";
  spark.style.height = "6px";
  spark.style.background = "gold";
  spark.style.borderRadius = "50%";
  spark.style.pointerEvents = "none";
  spark.style.boxShadow = "0 0 10px gold, 0 0 20px rgba(255,215,0,0.6)";

  document.body.appendChild(spark);

  setTimeout(() => {
    spark.style.opacity = "0";
    spark.style.transform = "scale(2)";
  }, 10);

  setTimeout(() => {
    spark.remove();
  }, 1000);
}

/* ✨ ANIMACIÓN */
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

  if (pareja) {
    pareja.position.y = Math.sin(t) * 0.05;
    pareja.position.x += (mouseX * 0.25 - pareja.position.x) * 0.05;
  }

  renderer.render(scene, camera);
}