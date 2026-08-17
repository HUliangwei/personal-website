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

Do not render Brush splat PLY with `PLYLoader + THREE.Points`, and do not add model-specific manual rotations in the website.

## GLB · fallback

If PLY is absent, `hlw.glb` is loaded with `GLTFLoader`.

The site no longer forces a hard-coded scale, Y offset, or model rotation. It computes the real bounds with:

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
