import * as THREE from "three";

interface UpdateUniformsFromControlsParams {
  material: THREE.ShaderMaterial;
  controls: Record<string, any>;
  clock: THREE.Clock;
  mouse: THREE.Vector2;
  size: { width: number; height: number };
}

export function updateUniformsFromControls({
  material,
  controls,
  clock,
  mouse,
  size,
}: UpdateUniformsFromControlsParams) {
  const uniforms = material.uniforms;

  // Update time
  if (uniforms.u_time) {
    uniforms.u_time.value = clock.getElapsedTime();
  }

  // Update resolution
  if (uniforms.u_resolution) {
    uniforms.u_resolution.value.set(size.width, size.height);
  }

  // Update mouse
  if (uniforms.u_mouse) {
    if (controls.enableMouse) {
      uniforms.u_mouse.value.set(
        mouse.x * 0.5 + 0.5,
        1.0 - (mouse.y * 0.5 + 0.5)
      );
    } else {
      uniforms.u_mouse.value.set(0.5, 0.5);
    }
  }

  // Update all other uniforms from controls if they exist
  Object.entries(controls).forEach(([key, value]) => {
    const uniform = uniforms[`u_${key}`];

    if (!uniform) return;

    // Handle different types
    if (uniform.value instanceof THREE.Color && typeof value === "string") {
      uniform.value.set(value);
    } else if (
      uniform.value instanceof THREE.Vector2 &&
      value?.x !== undefined &&
      value?.y !== undefined
    ) {
      uniform.value.set(value.x, value.y);
    } else if (
      uniform.value instanceof THREE.Vector3 &&
      value?.x !== undefined &&
      value?.y !== undefined &&
      value?.z !== undefined
    ) {
      uniform.value.set(value.x, value.y, value.z);
    } else if (typeof uniform.value === "number") {
      uniform.value = value;
    } else if (typeof uniform.value === "boolean") {
      uniform.value = value;
    } else if (Array.isArray(uniform.value) && Array.isArray(value)) {
      uniform.value = value;
    }
  });
}
