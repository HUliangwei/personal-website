# HLW 3D Model Guide · V5

Home model priority:

```text
public/models/hlw.ply
        ↓ absent
public/models/hlw.glb
        ↓ absent
procedural Three.js fallback
```

## PLY · preferred

`hlw.ply` is treated as a Gaussian Splat asset and rendered with the same core path used by `Videoto3D/gui/viewer`:

```ts
import { SparkRenderer, SplatMesh } from '@sparkjsdev/spark'

const spark = new SparkRenderer({ renderer })
const splat = new SplatMesh({
  url: '/models/hlw.ply',
  onLoad: (mesh) => {
    const box = mesh.getBoundingBox(true)
  },
})
```

The portfolio pins `@sparkjsdev/spark` to `2.1.0`.

Do not render Brush splat PLY with `PLYLoader + THREE.Points`.

## PLY orientation

The Home splat is displayed with an owner-requested orientation: **180° up-down and 180° left-right**. `src/scripts/home-scene.ts` applies `loadedMesh.rotation.x = Math.PI` and `loadedMesh.rotation.y = Math.PI` in the `SplatMesh` `onLoad` callback **before** computing the bounding box, then rotates the local box into world space with `applyMatrix4(loadedMesh.matrixWorld)` so the camera framing matches the displayed orientation. Keep that rotation ahead of the bounds computation if the model is replaced.

## GLB · fallback

If PLY is absent, `hlw.glb` is loaded with `GLTFLoader`.

The site does not force a hard-coded scale or Y offset. The PLY rotation above is the only model-specific transform; the GLB fallback keeps its authored transform. Bounds are computed with:

```ts
new THREE.Box3().setFromObject(model.scene)
```

## Camera fit

Both formats use a bounds-based fit patterned after Videoto3D's viewer:

- obtain `Box3`
- get center and maximum dimension
- derive distance from camera FOV
- look at the actual model center

The preferred PLY uses Videoto3D's explicit **Front** direction `(0, 0, 1)` so the Home hero does not look down at the splat from the previous Iso angle.

The GLB fallback keeps the Iso direction `(0.8, 0.5, 1)` because its authored transform is preserved.

This keeps later model replacement independent from one-off transforms.

## Replacement

Preferred:
`public/models/hlw.ply`

Fallback:
`public/models/hlw.glb`

If both exist, PLY wins.

After replacement:

```powershell
npm test
npm run build
git diff --check
```
