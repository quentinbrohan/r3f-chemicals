# Known Issues

## Bug: Disabling postprocessing via Leva breaks cables and monitor frames

**Symptom:** Toggling `Scene/Postprocessing → Enabled` off makes floor/ceiling cables disappear and monitor frames vanish.

**Root cause:** The WebGL context (`<Canvas gl={...}>`) is initialized once with `depth: false, stencil: false, toneMapping: NoToneMapping, outputColorSpace: LinearSRGBColorSpace` when `postprocessing=true`. These are static — the WebGL context cannot be reconfigured at runtime. Disabling the `EffectComposer` at runtime leaves the scene rendering with no depth buffer, which breaks depth sorting and makes geometry invisible or incorrectly ordered.

**Fix options:**
- Always initialize the canvas with depth/stencil enabled and stop passing those flags via the `postprocessing` prop. The EffectComposer `depthBuffer` prop handles what it needs internally in recent versions of `@react-three/postprocessing`.
- Or: remove the `effectComposerEnabled` toggle from Leva — it's a debug-only panel anyway and that toggle was never meant for production use.

---

## Improvement: Leva controls quality

- No `vec3` controls for position/rotation — all positions are flat `[x, y, z]` values with no vector widget
- Folder hierarchy is flat strings (`"Scene/Objects/Monitors/Frame Material"`) rather than nested `folder()` calls, making reordering/grouping harder
- No conditional fields (e.g. hiding postprocessing sub-controls when `Enabled` is false)
- Point lights for each hormone are in `Monitors.tsx` but use the `"Scene/Lights/*"` prefix, so they're split from the stage's own light controls

---

## Missing: WebGL disposal on unmount

R3F objects (geometries, materials, textures, render targets) are not explicitly disposed when the scene unmounts. On route change, textures from `useTexture`, geometries cloned in `fixedGeometries`, and the `MeshReflectorMaterial` render targets stay in GPU memory.

**Fix:** Add `dispose()` calls in `useEffect` cleanup in `Monitors.tsx` and `MonitorsStage/index.tsx`, or use R3F's `useGLTF` with a cleanup hook.

---

## Exploration: Scene tweaks (lights, fog, material adjustments)

Needs manual live exploration in the Leva panel — not a code change.

---

## Exploration: Side monitor rotation conflict

The side monitors (Dopamine/Serotonin) appear to have a rotation issue that becomes visible when postprocessing is disabled. May be a render order / depth sort conflict with the overlapping frame meshes at `renderOrder: 0` and monitor screens at `renderOrder: 1`. Investigate with `depthTest`/`depthWrite` on the materials.
