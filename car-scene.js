// 3D car scene via Three.js with GLB loader.
// Loads assets/car.glb with embedded PBR materials + textures.
// Rotates with scroll. Streamlines as 3D tubes (blue→red).

(function () {
  const section = document.getElementById('car-scene');
  if (!section) return;
  const host = section.querySelector('.car-three');
  const panels = section.querySelectorAll('.car-panel');
  const progressFill = section.querySelector('.car-progress-fill');
  const progressLabel = section.querySelector('.car-progress-label');
  if (!host || !window.THREE) return;

  const THREE = window.THREE;
  const STEPS = 4;
  const STEP_LABELS = ['GEOMETRY', 'EXTERNAL FLOW', 'MESH', 'RESULTS'];

  // --- Scene ---
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  camera.position.set(0, 1.6, 8);
  camera.lookAt(0, 0.4, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.appendChild(renderer.domElement);

  // Environment map for PBR reflections — neutral studio via PMREM
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x0a0a0e);
  // Fake studio with colored lights baked into cubemap
  const envLight1 = new THREE.PointLight(0xffffff, 50, 0, 2);
  envLight1.position.set(5, 8, 5); envScene.add(envLight1);
  const envLight2 = new THREE.PointLight(0x88aaff, 30, 0, 2);
  envLight2.position.set(-5, 4, -4); envScene.add(envLight2);
  const envLight3 = new THREE.PointLight(0xffaa66, 25, 0, 2);
  envLight3.position.set(0, 2, -6); envScene.add(envLight3);
  const envTex = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = envTex;

  // Direct lights to sharpen shadows / highlights
  scene.add(new THREE.HemisphereLight(0xbfd6ff, 0x1a1a22, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(5, 8, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x88aaff, 0.5);
  fill.position.set(-5, 4, -4);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xff9a6a, 0.4);
  rim.position.set(0, 2, -8);
  scene.add(rim);

  // --- Car group ---
  const carGroup = new THREE.Group();
  scene.add(carGroup);

  // Shadow disc
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(2.4, 40),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.001;
  carGroup.add(shadow);

  // Placeholder while GLB loads
  const placeholder = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.3, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x20242c, roughness: 0.9 })
  );
  placeholder.position.y = 0.2;
  carGroup.add(placeholder);

  // Material override registry for tweaks (applied as override to all car meshes)
  let carMeshes = [];
  let originalMaterials = new WeakMap();

  const overrideMaterials = {
    carbon: new THREE.MeshStandardMaterial({
      color: 0x15171c, metalness: 0.55, roughness: 0.45
    }),
    paint: new THREE.MeshPhysicalMaterial({
      color: 0xff6a3d, metalness: 0.2, roughness: 0.35,
      clearcoat: 0.9, clearcoatRoughness: 0.12
    }),
    ghost: new THREE.MeshStandardMaterial({
      color: 0xd8e4f5, metalness: 0.1, roughness: 0.6,
      transparent: true, opacity: 0.5
    })
  };

  function applyMaterial(name) {
    if (!carMeshes.length) return;
    carMeshes.forEach((m) => {
      if (name === 'original') {
        const orig = originalMaterials.get(m);
        if (orig) m.material = orig;
      } else {
        m.material = overrideMaterials[name] || m.material;
      }
    });
  }
  window.__setCarMaterial = applyMaterial;

  // --- GLB Loader — loaded statically in HTML, use synchronously ---
  function loadCar() {
    if (!THREE.GLTFLoader) {
      console.warn('GLTFLoader missing');
      return;
    }
    const loader = new THREE.GLTFLoader();
    loader.load('assets/car.glb', (gltf) => {
      const root = gltf.scene || gltf.scenes[0];

      const bbox = new THREE.Box3().setFromObject(root);
      const size = new THREE.Vector3(); bbox.getSize(size);
      const center = new THREE.Vector3(); bbox.getCenter(center);
      const target = 5.0;
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = target / maxDim;

      root.position.sub(center);
      root.scale.setScalar(scale);

      const bbox2 = new THREE.Box3().setFromObject(root);
      root.position.y -= bbox2.min.y;

      carGroup.remove(placeholder);
      carGroup.add(root);

      root.traverse((obj) => {
        if (obj.isMesh) {
          carMeshes.push(obj);
          originalMaterials.set(obj, obj.material);
          obj.castShadow = true;
          obj.receiveShadow = true;
          if (obj.material) {
            obj.material.envMapIntensity = 0.9;
          }
        }
      });
    }, undefined, (err) => {
      console.warn('GLB load failed:', err);
    });
  }
  loadCar();

  // --- Streamlines (3D tubes) ---
  const streamGroup = new THREE.Group();
  scene.add(streamGroup);

  function makeStream(yOffset, zOffset) {
    const points = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const x = 4 - t * 8;
      const bump = Math.exp(-Math.pow((x - 0.5) * 1.2, 2)) * 0.4;
      const y = yOffset + bump;
      const z = zOffset + Math.sin(t * Math.PI * 2) * 0.05;
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const geom = new THREE.TubeGeometry(curve, 80, 0.012, 8, false);
    const colors = [];
    const posAttr = geom.attributes.position;
    const cBlue = new THREE.Color(0x5aa8ff);
    const cRed = new THREE.Color(0xff7a3d);
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const t = Math.max(0, Math.min(1, (4 - x) / 8));
      const c = cBlue.clone().lerp(cRed, t);
      colors.push(c.r, c.g, c.b);
    }
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const mat = new THREE.MeshBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0
    });
    return new THREE.Mesh(geom, mat);
  }

  const streams = [];
  const rows = [
    { y: 0.2, zs: [-0.9, -0.5, -0.2, 0.2, 0.5, 0.9] },
    { y: 0.6, zs: [-0.8, -0.4, 0, 0.4, 0.8] },
    { y: 1.0, zs: [-0.6, -0.2, 0.2, 0.6] },
    { y: 1.4, zs: [-0.3, 0, 0.3] }
  ];
  rows.forEach((row) => {
    row.zs.forEach((z) => {
      const s = makeStream(row.y, z);
      streamGroup.add(s);
      streams.push(s);
    });
  });

  // --- Resize ---
  function resize() {
    const r = host.getBoundingClientRect();
    const w = r.width, h = r.height;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
  new ResizeObserver(resize).observe(host);

  // --- Scroll driver ---
  let scrollP = 0, targetP = 0;

  function update() {
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    targetP = total > 0 ? scrolled / total : 0;

    panels.forEach((el) => {
      const start = parseFloat(el.dataset.start);
      const end = parseFloat(el.dataset.end);
      const fadeIn = 0.08;
      let op = 0, ty = 20;
      const p = targetP;
      if (p >= start - fadeIn && p <= end + fadeIn) {
        if (p < start) op = (p - (start - fadeIn)) / fadeIn;
        else if (p > end) op = 1 - (p - end) / fadeIn;
        else op = 1;
        ty = (1 - op) * 24;
      }
      op = Math.max(0, Math.min(1, op));
      el.style.opacity = String(op);
      el.style.transform = `translateY(${ty}px)`;
    });

    const step = Math.min(STEPS - 1, Math.floor(targetP * STEPS));
    if (progressFill) progressFill.style.width = (targetP * 100).toFixed(1) + '%';
    if (progressLabel) progressLabel.textContent =
      `${String(step + 1).padStart(2, '0')} / ${String(STEPS).padStart(2, '0')} · ${STEP_LABELS[step]}`;
  }

  function render() {
    update();
    scrollP += (targetP - scrollP) * 0.08;

    const rotY = -0.5 + scrollP * Math.PI * 2;
    const tiltCurve = Math.sin(scrollP * Math.PI);
    carGroup.rotation.y = rotY;
    carGroup.rotation.x = tiltCurve * 0.18;

    camera.position.y = 1.4 + tiltCurve * 0.9;
    camera.position.z = 8 - tiltCurve * 0.8;
    camera.lookAt(0, 0.6, 0);

    streams.forEach((s, i) => {
      const delay = (i / streams.length) * 0.15;
      let op = 0;
      if (scrollP > 0.15 + delay) op = Math.min(0.9, (scrollP - 0.15 - delay) * 2.5);
      if (scrollP > 0.85) op *= Math.max(0, 1 - (scrollP - 0.85) * 6);
      s.material.opacity = op * 0.85;
    });
    streamGroup.rotation.y = rotY;
    streamGroup.rotation.x = tiltCurve * 0.18;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();

  window.addEventListener('scroll', update, { passive: true });
})();
