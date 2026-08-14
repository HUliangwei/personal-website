import * as THREE from 'three';

interface HomeSceneOptions {
  canvas: HTMLCanvasElement;
  host: HTMLElement;
  modelUrl?: string;
  signal?: AbortSignal;
}

const CAMERA_PRESETS: Record<string, [number, number, number]> = {
  device: [0.15, 2.1, 8.5],
  signal: [-0.75, 2.45, 8.15],
  compute: [0.8, 1.9, 7.75],
  system: [1.15, 2.55, 8.35],
  robot: [-0.35, 2.15, 8.6],
  overview: [0.15, 2.1, 8.5],
};

function createResearchScene() {
  const root = new THREE.Group();
  root.name = 'hlw-procedural-research-scene';

  const blue = new THREE.MeshStandardMaterial({ color: 0x166ac5, roughness: 0.35, metalness: 0.35 });
  const cyan = new THREE.MeshStandardMaterial({ color: 0x55c2d8, roughness: 0.4, metalness: 0.15 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x27374a, roughness: 0.5, metalness: 0.45 });
  const pale = new THREE.MeshStandardMaterial({ color: 0xdce9f5, roughness: 0.65, metalness: 0.05 });

  const device = new THREE.Group();
  const sensor = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.82, 0.4, 8), graphite);
  sensor.rotation.x = Math.PI / 2;
  device.add(sensor);
  for (let index = 0; index < 8; index += 1) {
    const pixel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.2), cyan);
    pixel.position.set((index % 4 - 1.5) * 0.25, (Math.floor(index / 4) - 0.5) * 0.25, 0.35);
    device.add(pixel);
  }
  device.position.set(-3.2, 0.75, 0);
  root.add(device);

  const compute = new THREE.Group();
  const die = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 0.45), blue);
  die.rotation.set(0.25, 0.35, 0.08);
  compute.add(die);
  for (let index = 0; index < 8; index += 1) {
    const pin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 0.12), pale);
    const side = index < 4 ? -1 : 1;
    pin.position.set(side * 0.86, (index % 4 - 1.5) * 0.33, 0);
    pin.rotation.z = Math.PI / 2;
    compute.add(pin);
  }
  compute.position.set(0, 1.05, -0.25);
  root.add(compute);

  const robot = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.85, 0.75), graphite);
  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 1), pale);
  const joint = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), blue);
  const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.85, 4, 8), cyan);
  head.position.y = 0.95;
  joint.position.set(-0.75, 0.2, 0);
  arm.position.set(-1.15, -0.18, 0);
  arm.rotation.z = -0.65;
  robot.add(body, head, joint, arm);
  robot.position.set(3.05, 0.95, 0.1);
  root.add(robot);

  const pathPoints = [
    new THREE.Vector3(-2.45, 0.8, 0),
    new THREE.Vector3(-1.65, 1.35, -0.15),
    new THREE.Vector3(-0.85, 0.82, 0.1),
    new THREE.Vector3(0.8, 1.1, -0.1),
    new THREE.Vector3(1.65, 1.55, 0.15),
    new THREE.Vector3(2.4, 0.95, 0),
  ];
  const signalCurve = new THREE.CatmullRomCurve3(pathPoints);
  const signal = new THREE.Mesh(new THREE.TubeGeometry(signalCurve, 48, 0.035, 6, false), cyan);
  root.add(signal);

  const pulses = [0, 0.33, 0.66].map((phase) => {
    const pulse = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), pale);
    pulse.userData.phase = phase;
    root.add(pulse);
    return pulse;
  });

  return { root, signalCurve, pulses };
}

async function loadVerifiedModel(modelUrl: string, signal?: AbortSignal) {
  const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
  const loader = new GLTFLoader();
  const response = await fetch(modelUrl, { signal });
  if (!response.ok) throw new Error(`Model request failed with ${response.status}`);
  const data = await response.arrayBuffer();
  if (signal?.aborted) throw signal.reason;
  const resourcePath = new URL('.', new URL(modelUrl, window.location.href)).href;
  const model = await loader.parseAsync(data, resourcePath);
  model.scene.name = 'verified-hlw-model';
  model.scene.position.set(0, -0.35, 0);
  model.scene.scale.setScalar(1.1);
  return model.scene;
}

function disposeObject3D(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  root.traverse((object) => {
    if (object instanceof THREE.SkinnedMesh) object.skeleton.dispose();
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of objectMaterials) {
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) textures.add(value);
      }
    }
  });

  textures.forEach((value) => value.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}

export async function initHomeScene({ canvas, host, modelUrl, signal }: HomeSceneOptions): Promise<() => void> {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(...CAMERA_PRESETS.device);
  camera.lookAt(0, 0.85, 0);

  scene.add(new THREE.HemisphereLight(0xe9f5ff, 0x17314a, 2.2));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
  keyLight.position.set(4, 7, 6);
  scene.add(keyLight);

  const grid = new THREE.GridHelper(12, 20, 0x3b8dd4, 0xb7c9da);
  grid.position.y = -0.05;
  const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
  for (const material of gridMaterials) {
    material.transparent = true;
    material.opacity = 0.18;
  }
  scene.add(grid);

  const { root, signalCurve, pulses } = createResearchScene();
  scene.add(root);
  const timer = new THREE.Timer();
  const cameraTarget = new THREE.Vector3(...CAMERA_PRESETS.device);
  const pointerTarget = new THREE.Vector2();
  const pointerCurrent = new THREE.Vector2();
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  let frame = 0;
  let inViewport = true;
  let documentVisible = !document.hidden;
  let disposed = false;

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();

  const render = () => {
    if (disposed || !inViewport || !documentVisible) return;
    timer.update();
    const elapsed = timer.getElapsed();
    pointerCurrent.lerp(pointerTarget, 0.045);
    root.rotation.y = Math.sin(elapsed * 0.23) * 0.08 + pointerCurrent.x * 0.08;
    root.rotation.x = pointerCurrent.y * 0.035;
    pulses.forEach((pulse, index) => {
      const progress = (elapsed * 0.09 + pulse.userData.phase) % 1;
      pulse.position.copy(signalCurve.getPoint(progress));
      pulse.scale.setScalar(0.75 + Math.sin(elapsed * 2.2 + index) * 0.18);
    });
    camera.position.lerp(cameraTarget, 0.025);
    camera.lookAt(pointerCurrent.x * 0.25, 0.85 + pointerCurrent.y * 0.12, 0);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  };
  const resume = () => {
    if (!disposed && inViewport && documentVisible && frame === 0) {
      timer.reset();
      frame = requestAnimationFrame(render);
    }
  };
  const pause = () => {
    if (frame !== 0) cancelAnimationFrame(frame);
    frame = 0;
  };

  const viewportObserver = new IntersectionObserver(([entry]) => {
    inViewport = entry?.isIntersecting ?? false;
    inViewport ? resume() : pause();
  }, { rootMargin: '120px 0px' });
  viewportObserver.observe(host);

  const focusElements = document.querySelectorAll<HTMLElement>('[data-scene-focus]');
  const focusObserver = new IntersectionObserver((entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!active) return;
    const focus = (active.target as HTMLElement).dataset.sceneFocus ?? 'overview';
    cameraTarget.set(...(CAMERA_PRESETS[focus] ?? CAMERA_PRESETS.overview));
  }, { rootMargin: '-20% 0px -55%', threshold: [0, 0.25, 0.6] });
  focusElements.forEach((element) => focusObserver.observe(element));

  const handlePointer = (event: PointerEvent) => {
    pointerTarget.set((event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * -2);
  };
  const handleVisibility = () => {
    documentVisible = !document.hidden;
    documentVisible ? resume() : pause();
  };
  if (finePointer) window.addEventListener('pointermove', handlePointer, { passive: true });
  document.addEventListener('visibilitychange', handleVisibility);

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    signal?.removeEventListener('abort', dispose);
    pause();
    timer.dispose();
    resizeObserver.disconnect();
    viewportObserver.disconnect();
    focusObserver.disconnect();
    window.removeEventListener('pointermove', handlePointer);
    document.removeEventListener('visibilitychange', handleVisibility);
    disposeObject3D(scene);
    grid.geometry.dispose();
    gridMaterials.forEach((material) => material.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    delete host.dataset.sceneReady;
  };

  signal?.addEventListener('abort', dispose, { once: true });
  if (signal?.aborted) {
    dispose();
    return dispose;
  }

  host.dataset.sceneReady = '';
  resume();

  if (modelUrl) {
    try {
      const model = await loadVerifiedModel(modelUrl, signal);
      if (disposed) disposeObject3D(model);
      else {
        scene.add(model);
        root.visible = false;
      }
    } catch {
      if (!disposed) root.visible = true;
    }
  }

  return dispose;
}
