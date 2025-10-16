import { omit } from "lodash-es";
import { fragmentShader, vertexShader } from "./fbm";
import * as THREE from "three";

const sharedUniforms: THREE.ShaderMaterial["uniforms"] = {
  u_time: { value: 0 },
  u_mouse: { value: new THREE.Vector2(0.5, 0.5) },

  u_uvScale: { value: 3.5 },
  u_timeSpeed: { value: 0.08 },
  u_flowDirection: { value: new THREE.Vector2(0.12, 0.05) },

  u_mouseRadius: { value: 0.5 },
  u_mouseStrength: { value: 0.3 },

  u_baseColor: { value: new THREE.Color("#FF6B35") },
  u_secondaryColor: { value: new THREE.Color("#C41E3A") },
  u_glowColor: { value: new THREE.Color("#8B008B") },
  u_colorSeparation: { value: 0.4 },
  u_colorSharpness: { value: 0.15 },
  u_brightnessFloor: { value: 0.2 },
  u_glowStrength: { value: 3.0 },

  u_colorPower: { value: 1.5 },
  u_colorVibration: { value: 0.3 },

  u_randSeed: { value: new THREE.Vector2(1.9898, 4.1414) },
  u_randMultiplier: { value: 43758.5453 },

  u_noiseSmoothA: { value: 3.0 },
  u_noiseSmoothB: { value: 2.0 },

  u_fbmRotation: { value: new THREE.Matrix2().set(0.8, -0.6, 0.6, 0.8) },
  u_fbmOctave1: { value: 0.5 },
  u_fbmOctave2: { value: 0.25 },
  u_fbmOctave3: { value: 0.125 },
  u_fbmOctave4: { value: 0.0625 },
  u_fbmScale1: { value: 2.02 },
  u_fbmScale2: { value: 2.03 },
  u_fbmScale3: { value: 2.01 },
  u_fbmNorm: { value: 0.769 },

  u_patternOffset1: { value: new THREE.Vector2(0.0, 0.0) },
  u_patternQMult: { value: 4.0 },
  u_patternOffset2: { value: new THREE.Vector2(1.7, 9.2) },
  u_patternFinalMult: { value: 1.76 },
};

export const getDopamineShaderMaterial = (
  config: Partial<THREE.ShaderMaterial> & {
    uniforms: THREE.ShaderMaterial["uniforms"] & {
      u_resolution: THREE.IUniform<any>;
    };
  }
): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      ...sharedUniforms,
      u_turbulence: { value: 0.3 },
      u_directionalWarp: { value: 0.2 },
      ...(config.uniforms as THREE.ShaderMaterial["uniforms"]),
    },
    transparent: false,
    ...omit(config, "uniforms"),
  });
};

export const getOxytocinShaderMaterial = (
  config: Partial<THREE.ShaderMaterial> & {
    uniforms: THREE.ShaderMaterial["uniforms"] & {
      u_resolution: THREE.IUniform<any>;
    };
  }
): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      ...sharedUniforms,
      u_turbulence: { value: 0.3 },
      u_directionalWarp: { value: 0.2 },
      ...(config.uniforms as THREE.ShaderMaterial["uniforms"]),
    },
    transparent: false,
    ...omit(config, "uniforms"),
  });
};

export const getSerotoninShaderMaterial = (
  config: Partial<THREE.ShaderMaterial> & {
    uniforms: THREE.ShaderMaterial["uniforms"] & {
      u_resolution: THREE.IUniform<any>;
    };
  }
): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      ...sharedUniforms,
      u_displacementMult: { value: 1.8 },
      ...(config.uniforms as THREE.ShaderMaterial["uniforms"]),
    },
    transparent: false,
    ...omit(config, "uniforms"),
  });
};
