import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const root = document.documentElement;
const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const modelViewer = document.querySelector("#shoeModel");
const configShoe = document.querySelector(".config-shoe");
const swatches = document.querySelectorAll(".swatch");
const productCards = document.querySelectorAll(".product-card");
const cartCount = document.querySelector(".cart-count");
const addCartBtn = document.querySelector(".add-cart-btn");
const saveBtn = document.querySelector(".save-btn");
const reserveBtn = document.querySelector(".reserve-btn");
const cartBtn = document.querySelector(".cart-btn");
const profileBtn = document.querySelector(".profile-btn");
const toast = document.querySelector(".toast");

let cartItems = 0;
let selectedModel = "Phantom Black";
let selectedPrice = 280;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function setCartCount(value) {
  cartItems = value;
  cartCount.textContent = String(cartItems);
}

function updateCheckoutButton() {
  addCartBtn.textContent = `Añadir al carrito - $${selectedPrice}`;
}

window.addEventListener("mousemove", (event) => {
  root.style.setProperty("--mx", `${event.clientX}px`);
  root.style.setProperty("--my", `${event.clientY}px`);
});

function initShoeModel() {
  if (!modelViewer) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.08, 5.35);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  modelViewer.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xa6e6ff, 0x050505, 1.8));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x14d1ff, 3.4);
  rimLight.position.set(-4, 1.5, -3);
  scene.add(rimLight);

  const floorGlow = new THREE.PointLight(0x14d1ff, 8, 7);
  floorGlow.position.set(0, -1.25, 1.4);
  scene.add(floorGlow);

  const group = new THREE.Group();
  group.rotation.set(-0.05, -0.38, 0.04);
  group.position.y = 0.62;
  scene.add(group);

  const loader = new GLTFLoader();
  loader.load(
    "modelo_zapato_landingpage.glb",
    (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxAxis = Math.max(size.x, size.y, size.z);

      model.position.sub(center);
      model.scale.setScalar(2.08 / maxAxis);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.envMapIntensity = 1.2;
        }
      });

      group.add(model);
      modelViewer.querySelector(".model-loader")?.remove();
    },
    undefined,
    () => {
      const loaderText = modelViewer.querySelector(".model-loader");
      if (loaderText) loaderText.textContent = "No se pudo cargar el modelo 3D";
    }
  );

  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let targetRotationY = group.rotation.y;
  let targetRotationX = group.rotation.x;

  function resizeRenderer() {
    const { width, height } = modelViewer.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  }

  function onPointerDown(event) {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    modelViewer.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!isDragging) return;

    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;

    targetRotationY += deltaX * 0.006;
    targetRotationX += deltaY * 0.004;
    targetRotationX = Math.max(-0.75, Math.min(0.65, targetRotationX));
  }

  function onPointerUp(event) {
    isDragging = false;
    if (modelViewer.hasPointerCapture(event.pointerId)) {
      modelViewer.releasePointerCapture(event.pointerId);
    }
  }

  modelViewer.addEventListener("pointerdown", onPointerDown);
  modelViewer.addEventListener("pointermove", onPointerMove);
  modelViewer.addEventListener("pointerup", onPointerUp);
  modelViewer.addEventListener("pointercancel", onPointerUp);
  window.addEventListener("resize", resizeRenderer);

  function animate() {
    group.rotation.y += (targetRotationY - group.rotation.y) * 0.08;
    group.rotation.x += (targetRotationX - group.rotation.x) * 0.08;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  resizeRenderer();
  animate();
}

initShoeModel();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

menuToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

swatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    swatches.forEach((item) => item.classList.remove("active"));
    swatch.classList.add("active");
    configShoe.classList.remove("black", "silver", "blue");
    configShoe.classList.add(swatch.dataset.color);
    showToast(`Color ${swatch.getAttribute("aria-label")} aplicado.`);
  });
});

productCards.forEach((card) => {
  const button = card.querySelector(".mini-btn");

  button.addEventListener("click", () => {
    selectedModel = card.dataset.model;
    selectedPrice = Number(card.dataset.price);
    updateCheckoutButton();
    document.querySelector("#custom").scrollIntoView({ behavior: "smooth" });
    showToast(`${selectedModel} seleccionado para configurar.`);
  });
});

addCartBtn?.addEventListener("click", () => {
  setCartCount(cartItems + 1);
    showToast(`${selectedModel} fue agregado al carrito.`);
});

saveBtn?.addEventListener("click", () => {
  showToast("Diseño guardado en tu configuración.");
});

reserveBtn?.addEventListener("click", () => {
  document.querySelector("#custom").scrollIntoView({ behavior: "smooth" });
  showToast("Reserva iniciada. Elige tu configuracion.");
});

cartBtn?.addEventListener("click", () => {
  showToast(cartItems ? `Tienes ${cartItems} producto(s) en el carrito.` : "Tu carrito está vacío.");
});

profileBtn?.addEventListener("click", () => {
  showToast("Perfil AURIX listo para sincronizar.");
});

document.querySelectorAll(".hotspot").forEach((hotspot) => {
  hotspot.addEventListener("click", () => {
    showToast(hotspot.dataset.hotspot);
  });
});

updateCheckoutButton();
