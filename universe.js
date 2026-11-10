const THREE_VERSION = "0.187.0";
const THREE_URL = `https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}/build/three.module.js`;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const coarsePointer = matchMedia("(pointer: coarse)");
const mobile = matchMedia("(max-width: 640px)");
const names = ["COLLABRYD", "SMARTRIDE CONNECT", "AQORA FORMS", "SKILLSCOPE", "ASYNCNODE"];
let threePromise;

function loadThree() {
  threePromise ??= import(THREE_URL);
  return threePromise;
}

function makeRenderer(canvas) {
  try {
    if (!canvas || !window.WebGLRenderingContext) return null;
    return new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !mobile.matches,
      powerPreference: "low-power",
      stencil: false,
      depth: true,
    });
  } catch (error) {
    console.info("WebGL is unavailable; keeping the accessible 2D portfolio.", error);
    return null;
  }
}

function configureRenderer(renderer, canvas) {
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile.matches ? 1.15 : 1.35));
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x090909, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  return { width, height };
}

function addAtmosphere(scene, count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const green = new THREE.Color(0xb6f09c);
  const white = new THREE.Color(0xe9ebd9);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    const tint = Math.random() > 0.83 ? green : white;
    const strength = 0.26 + Math.random() * 0.52;
    colors[i * 3] = tint.r * strength;
    colors[i * 3 + 1] = tint.g * strength;
    colors[i * 3 + 2] = tint.b * strength;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size: 0.024, vertexColors: true, transparent: true, opacity: 0.72, sizeAttenuation: true, depthWrite: false });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}

function makeLights(scene) {
  scene.add(new THREE.AmbientLight(0x7b8977, 1.15));
  const key = new THREE.DirectionalLight(0xf2eee0, 3.3);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const green = new THREE.PointLight(0xb6f09c, 18, 10, 2);
  green.position.set(3, -1, 2);
  scene.add(green);
  const rim = new THREE.PointLight(0x6fbd96, 15, 9, 2);
  rim.position.set(-3, -2, -2);
  scene.add(rim);
}

function makeHero(canvas) {
  const renderer = makeRenderer(canvas);
  if (!renderer) return null;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.set(0, 0, 5.1);
  makeLights(scene);
  const sculpture = new THREE.Group();
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xc8cbbf, metalness: 0.78, roughness: 0.22, clearcoat: 0.8, clearcoatRoughness: 0.17 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xb6f09c, metalness: 0.42, roughness: 0.16, transmission: 0.12, transparent: true, opacity: 0.82, clearcoat: 1 });
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.94, 0.255, 144, 16, 2, 3), chrome);
  sculpture.add(knot);
  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 1), glass);
  inner.rotation.set(0.32, 0.15, 0.4);
  sculpture.add(inner);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.37, 0.012, 5, 128), new THREE.MeshBasicMaterial({ color: 0xb6f09c, transparent: true, opacity: 0.62 }));
  halo.rotation.set(0.95, 0.3, 0.1);
  sculpture.add(halo);
  sculpture.scale.setScalar(mobile.matches ? 0.76 : 0.94);
  scene.add(sculpture);
  const particles = addAtmosphere(scene, mobile.matches ? 90 : 260);
  const pointer = new THREE.Vector2();
  const target = new THREE.Vector2();
  const bounds = () => canvas.getBoundingClientRect();
  const move = (event) => {
    const rect = bounds();
    target.set(((event.clientX - rect.left) / rect.width - 0.5) * 2, ((event.clientY - rect.top) / rect.height - 0.5) * -2);
  };
  window.addEventListener("pointermove", move, { passive: true });
  const resize = () => {
    const { width, height } = configureRenderer(renderer, canvas);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    sculpture.scale.setScalar(mobile.matches ? 0.76 : 0.94);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  return {
    renderer,
    scene,
    camera,
    dispose() {
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      renderer.dispose();
      knot.geometry.dispose(); chrome.dispose(); inner.geometry.dispose(); glass.dispose(); halo.geometry.dispose(); halo.material.dispose();
      particles.geometry.dispose(); particles.material.dispose();
    },
    draw(time) {
      const t = time * 0.001;
      pointer.lerp(target, 0.035);
      sculpture.rotation.y += ((t * 0.12 + pointer.x * 0.17) - sculpture.rotation.y) * 0.025;
      sculpture.rotation.x += ((-pointer.y * 0.12) - sculpture.rotation.x) * 0.025;
      halo.rotation.z = t * 0.06 + pointer.x * 0.08;
      particles.rotation.y = t * 0.008 + pointer.x * 0.012;
      renderer.render(scene, camera);
    },
  };
}

function exhibitGeometry(index, material, accent) {
  const group = new THREE.Group();
  let core;
  if (index === 0) core = new THREE.TorusKnotGeometry(0.42, 0.115, 84, 10, 2, 3);
  if (index === 1) core = new THREE.TorusGeometry(0.51, 0.075, 12, 72);
  if (index === 2) core = new THREE.OctahedronGeometry(0.57, 0);
  if (index === 3) core = new THREE.IcosahedronGeometry(0.55, 1);
  if (index === 4) core = new THREE.BoxGeometry(0.72, 0.72, 0.72, 2, 2, 2);
  const main = new THREE.Mesh(core, material);
  group.add(main);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.77, 0.012, 5, 72), accent);
  ring.rotation.x = 0.7 + index * 0.08;
  ring.rotation.y = 0.35;
  group.add(ring);
  if (index === 2 || index === 3) {
    const outline = new THREE.Mesh(core.clone(), new THREE.MeshBasicMaterial({ color: 0xb6f09c, wireframe: true, transparent: true, opacity: 0.32 }));
    outline.scale.setScalar(1.035);
    group.add(outline);
  }
  return group;
}

function makeGallery(canvas, root) {
  const renderer = makeRenderer(canvas);
  if (!renderer) return null;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  camera.position.set(0, 0.1, mobile.matches ? 9.2 : 8.2);
  makeLights(scene);
  const exhibits = [];
  const base = new THREE.MeshPhysicalMaterial({ color: 0xc7cabc, metalness: 0.74, roughness: 0.24, clearcoat: 0.75 });
  const green = new THREE.MeshBasicMaterial({ color: 0xb6f09c, transparent: true, opacity: 0.75 });
  const colors = [0xd4d4c9, 0xb9d5be, 0xcbd0be, 0xc2c8d0, 0xcbd2c5];
  for (let i = 0; i < names.length; i += 1) {
    const material = base.clone();
    material.color.setHex(colors[i]);
    const group = exhibitGeometry(i, material, green);
    group.userData.exhibitIndex = i;
    exhibits.push(group);
    scene.add(group);
  }
  const particles = addAtmosphere(scene, mobile.matches ? 64 : 150);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const target = new THREE.Vector2();
  const hitMeshes = exhibits.flatMap((group, index) => group.children.map((child) => { child.userData.exhibitIndex = index; return child; }));
  let selected = 0;
  let progress = 0;
  let targetProgress = 0;
  const select = (index) => {
    selected = Math.max(0, Math.min(names.length - 1, index));
    root.querySelectorAll("[data-exhibit]").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.exhibit) === selected)));
    const readout = root.querySelector(".gallery-readout");
    if (readout) readout.textContent = `FOCUS / ${names[selected]}`;
  };
  root.querySelectorAll("[data-exhibit]").forEach((button) => {
    const index = Number(button.dataset.exhibit);
    button.setAttribute("aria-pressed", String(index === selected));
    button.addEventListener("pointerenter", () => select(index));
    button.addEventListener("focus", () => select(index));
    button.addEventListener("click", () => {
      select(index);
      root.closest(".work")?.querySelectorAll(".project")[index]?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
    });
  });
  window.addEventListener("portfolio:exhibit", (event) => select(event.detail.index));
  const setPointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    target.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -(((event.clientY - rect.top) / rect.height) * 2 - 1));
    pointer.copy(target);
    raycaster.setFromCamera(pointer, camera);
    const intersection = raycaster.intersectObjects(hitMeshes, false)[0];
    if (intersection) select(intersection.object.userData.exhibitIndex);
  };
  canvas.addEventListener("pointermove", setPointer, { passive: true });
  canvas.addEventListener("pointerdown", setPointer, { passive: true });
  const onScroll = () => {
    const rect = root.getBoundingClientRect();
    targetProgress = THREE.MathUtils.clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const resize = () => {
    const { width, height } = configureRenderer(renderer, canvas);
    camera.aspect = width / height;
    camera.position.z = mobile.matches ? 9.2 : 8.2;
    camera.updateProjectionMatrix();
    const span = (camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 2 * camera.aspect) * 0.62;
    exhibits.forEach((group, index) => { group.position.x = (index - 2) * span / 4; });
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  return {
    renderer,
    scene,
    camera,
    dispose() {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("pointermove", setPointer);
      canvas.removeEventListener("pointerdown", setPointer);
      renderer.dispose();
      base.dispose(); green.dispose(); particles.geometry.dispose(); particles.material.dispose();
      exhibits.forEach((group) => group.traverse((object) => { object.geometry?.dispose(); if (object.material && object.material !== green) object.material.dispose(); }));
    },
    draw(time) {
      const t = time * 0.001;
      progress += (targetProgress - progress) * 0.035;
      exhibits.forEach((group, index) => {
        const distance = Math.abs(index - selected);
        const emphasis = distance === 0 ? 1.18 : 1;
        const phase = t * 0.32 + index * 1.21;
        group.position.y = Math.sin(phase) * (mobile.matches ? 0.07 : 0.12) - progress * 0.14;
        group.rotation.y = t * (0.16 + index * 0.012) + pointer.x * 0.12 + index * 0.22;
        group.rotation.x = Math.sin(phase * 0.6) * 0.12 + pointer.y * 0.08;
        group.scale.lerp(new THREE.Vector3(emphasis, emphasis, emphasis), 0.08);
      });
      particles.rotation.y = t * 0.006;
      if (reducedMotion.matches) exhibits.forEach((group, index) => { group.rotation.set(0.12, index * 0.18, 0); });
      renderer.render(scene, camera);
    },
  };
}

function attachLazyScene(canvas, root, createScene) {
  if (!canvas || !root) return;
  let scene;
  let active = false;
  let lastFrame = 0;
  let failed = false;
  const frame = (time) => {
    if (!active || document.hidden) return;
    const frameInterval = mobile.matches ? 1000 / 30 : 1000 / 48;
    if (!reducedMotion.matches && time - lastFrame < frameInterval) return;
    lastFrame = time;
    scene?.draw(time);
  };
  const setActive = (value) => {
    active = value;
    if (!scene || failed) return;
    if (active && !document.hidden && !reducedMotion.matches) scene.renderer.setAnimationLoop(frame);
    else {
      scene.renderer.setAnimationLoop(null);
      if (active && reducedMotion.matches) frame(performance.now());
    }
  };
  const visibility = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        if (!scene && !failed) {
          loadThree().then((THREE) => {
            window.THREE = THREE;
            scene = createScene(canvas, root);
            if (!scene) throw new Error("WebGL context could not be created");
            canvas.dataset.ready = "true";
            root.dataset.ready = "true";
            setActive(true);
            frame(performance.now());
          }).catch((error) => {
            failed = true;
            canvas.dataset.unavailable = "true";
            if (root.id === "gallery-experience") root.dataset.unavailable = "true";
            console.info("3D scene skipped; the 2D portfolio remains available.", error);
          });
        } else setActive(true);
      } else setActive(false);
    }
  }, { rootMargin: "120px 0px", threshold: 0.01 });
  visibility.observe(root);
  document.addEventListener("visibilitychange", () => setActive(active));
  reducedMotion.addEventListener?.("change", () => setActive(active));
}

const hero = document.querySelector("#hero-scene");
const gallery = document.querySelector("#gallery-scene");
attachLazyScene(hero, document.querySelector(".hero"), makeHero);
attachLazyScene(gallery, document.querySelector("#gallery-experience"), makeGallery);
