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
  material.uniforms.u_time.value = clock.getElapsedTime();

  if (controls.enableMouse) {
    material.uniforms.u_mouse.value.set(
      mouse.x * 0.5 + 0.5,
      1.0 - (mouse.y * 0.5 + 0.5)
    );
  } else {
    material.uniforms.u_mouse.value.set(0.5, 0.5);
  }

  material.uniforms.u_resolution.value.set(size.width, size.height);

  // Animation
  material.uniforms.u_uvScale.value = controls.uvScale;
  material.uniforms.u_timeSpeed.value = controls.timeSpeed;
  material.uniforms.u_flowDirection.value.set(
    controls.flowDirectionX,
    controls.flowDirectionY
  );

  // Mouse
  material.uniforms.u_mouseRadius.value = controls.mouseRadius;
  material.uniforms.u_mouseStrength.value = controls.enableMouse
    ? controls.mouseStrength
    : 0;

  // Colors
  material.uniforms.u_baseColor.value.set(controls.baseColor);
  material.uniforms.u_secondaryColor.value.set(controls.secondaryColor);
  material.uniforms.u_glowColor.value.set(controls.glowColor);
  material.uniforms.u_colorSeparation.value = controls.colorSeparation;
  material.uniforms.u_colorSharpness.value = controls.colorSharpness;
  material.uniforms.u_brightnessFloor.value = controls.brightnessFloor;
  material.uniforms.u_glowStrength.value = controls.glowStrength;

  if (controls?.displacementMult) {
    // material.uniforms.u_displacementMult.value = controls.displacementMult;
  }
  material.uniforms.u_colorPower.value = controls.colorPower;
  material.uniforms.u_colorVibration.value = controls.colorVibration;

  if (controls?.turbulence) {
    material.uniforms.u_turbulence.value = controls.turbulence;
  }
  if (controls?.directionalWarp) {
    material.uniforms.u_directionalWarp.value = controls.directionalWarp;
  }
  // material.uniforms.u_turbulence.value = controls.turbulence;
  // material.uniforms.u_directionalWarp.value = controls.directionalWarp;

  // Rand function
  material.uniforms.u_randSeed.value.set(
    controls.randSeedX,
    controls.randSeedY
  );
  material.uniforms.u_randMultiplier.value = controls.randMultiplier;

  // Noise function
  material.uniforms.u_noiseSmoothA.value = controls.smoothA;
  material.uniforms.u_noiseSmoothB.value = controls.smoothB;

  // FBM rotation matrix
  material.uniforms.u_fbmRotation.value.set(
    controls.m00,
    controls.m01,
    controls.m10,
    controls.m11
  );

  // FBM octaves
  material.uniforms.u_fbmOctave1.value = controls.octave1;
  material.uniforms.u_fbmOctave2.value = controls.octave2;
  material.uniforms.u_fbmOctave3.value = controls.octave3;
  material.uniforms.u_fbmOctave4.value = controls.octave4;

  // FBM scales
  material.uniforms.u_fbmScale1.value = controls.scale1;
  material.uniforms.u_fbmScale2.value = controls.scale2;
  material.uniforms.u_fbmScale3.value = controls.scale3;
  material.uniforms.u_fbmNorm.value = controls.fbmNorm;

  // Pattern function
  material.uniforms.u_patternOffset1.value.set(
    controls.patternOffset1X,
    controls.patternOffset1Y
  );
  material.uniforms.u_patternQMult.value = controls.patternQMult;
  material.uniforms.u_patternOffset2.value.set(
    controls.patternOffset2X,
    controls.patternOffset2Y
  );
  material.uniforms.u_patternFinalMult.value = controls.patternFinalMult;
}
