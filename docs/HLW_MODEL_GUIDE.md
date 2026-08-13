# HLW 3D Model Guide

This document defines the safe replacement contract for the optional portfolio model at `/models/hlw.glb`. The website is complete without that file: it renders a neutral procedural research scene and an accessible SVG fallback. Add a model only after its identity, likeness, textures, and redistribution rights have been verified.

## Scene contract

- File path: `public/models/hlw.glb`, served as `/models/hlw.glb`.
- Format: one self-contained binary GLB 2.0 file. Do not add external texture or buffer dependencies.
- Coordinates: export as glTF Y-up. Blender is Z-up; the exporter performs the axis conversion.
- Orientation: stand upright and face +Z in the resulting Three.js scene. The Home camera is on +Z and looks toward the model.
- Origin: place the origin on the ground plane, centered between the feet or at the base of a neutral bust. Keep the character centered on X and close to Z = 0.
- Dimensions: target an upright height of approximately 2.4–2.8 scene units after export. Apply object scale in Blender before export. The current loader adds a uniform `1.1` scene scale and a small downward offset.
- Neutral pose: use a relaxed A-pose or a stable research-engineer pose. Avoid props that imply unverified employment, awards, projects, or affiliations.

The current model loader does not normalize bounds. Test scale and origin in the actual Home scene before release; do not compensate by changing the camera unless the procedural fallback remains correctly framed.

## Camera and lighting assumptions

The scene uses a 34-degree perspective camera, generally positioned near `(0.15, 2.1, 8.5)` and looking toward `(0, 0.85, 0)`. Scroll focus states move the camera subtly, so important geometry should remain within roughly X ±1.4, Y 0–3, and Z ±1.

Lighting is provided by a soft hemisphere light and a white directional key light above and camera-right. Author physically based materials for this neutral setup:

- keep albedo values out of absolute black or white;
- use moderate roughness and restrained metallic values;
- avoid baked dramatic lighting, neon emission, and environment-specific reflections;
- verify that the silhouette remains readable on the site's pale background.

The viewer adds no custom environment map. Any look that depends on one is outside the current contract.

## Geometry, textures, and animation

- Polygon guidance: aim for 25k–70k rendered triangles; keep the total below about 100k unless measured mobile performance justifies more.
- Merge or instance repeated accessories where practical and remove hidden geometry.
- Prefer one or two materials. Avoid many small draw calls.
- Texture guidance: use 1K textures by default and 2K only for visibly important face or garment detail. Avoid 4K maps.
- Use WebP/PNG/JPEG images embedded in the GLB; use KTX2 only after adding and testing the matching decoder to the website.
- Include mipmaps through standards-compliant textures and keep color textures in sRGB. Treat normal, roughness, and metallic maps as non-color data.
- Apply modifiers, object transforms, and armature scale before export.
- Animation is optional. If included, provide a subtle looping idle clip, no audio, and no large displacement from the origin. The current runtime does not yet play model clips, so animation data is future-facing only.

## Optional focus nodes

The current implementation drives camera presets in code and does not require nodes embedded in the GLB. A future model may reserve empty nodes with these exact names:

- `Camera`
- `CameraAction`
- `focus-start`
- `focus-0`
- `focus-1`
- `focus-2`
- `focus-3`
- `focus-4`
- `focus-projects`

Place focus nodes in model-local space and keep them free of meshes. Adding them does not activate behavior today; future runtime support must remain optional and preserve the fallback.

## Blender export checklist

1. Confirm that all visible content belongs to Hu Liangwei or is licensed for public redistribution. Do not use the Sen reference author's `me.glb`, `sen.blend`, likeness, name, or portfolio content.
2. Remove cameras, lights, hidden collections, test geometry, personally identifying metadata, and unused materials unless a named optional node is intentional.
3. Apply rotation and scale, verify the origin and front direction, and inspect the evaluated triangle count.
4. Export only selected objects as glTF 2.0 / GLB with `+Y Up`, materials, normals, and required skinning data. Keep textures embedded.
5. Reopen the exported GLB in a clean viewer and check bounds, materials, skeleton, texture resolution, and animation loops.
6. Place the verified file at `public/models/hlw.glb`, run `npm test` and `npm run build`, then test the Home page at 320, 375, 768, 1024, and 1440 CSS pixels.
7. Check normal motion, `prefers-reduced-motion`, WebGL failure, forced colors, keyboard navigation, page visibility changes, and console errors.

## Fallback and failure behavior

The site checks for `public/models/hlw.glb` at build time. When absent, no model URL is emitted. When present, the browser fetches it only after the Home scene intersects the viewport and WebGL is available. A failed request or parse retains the procedural scene. Reduced-motion users, browsers without WebGL, and browsers without the required observer APIs retain the accessible SVG fallback.

Never remove that fallback or make navigation, copy, or project links depend on Three.js. The model is progressive enhancement, not content.
