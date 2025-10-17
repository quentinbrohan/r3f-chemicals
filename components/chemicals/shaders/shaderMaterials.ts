import { omit } from "lodash-es";
import { fragmentShader, serotoninFragmentShader, vertexShader } from "./fbm";
import * as THREE from "three";

type ShaderType = "dopamine" | "oxytocin" | "serotonin";

export const shaderUniformConfigs = {
  dopamine: {
    uvScale: 0.55,
    timeSpeed: 0.06,
    flowDirection: new THREE.Vector2(-0.08, -0.02),
    mouseRadius: 0.5,
    mouseStrength: 0.3,
    baseColor: "#ffb347",
    secondaryColor: "#6e1e96",
    glowColor: "#ffb347",
    colorSeparation: 0.38,
    colorSharpness: 0.15,
    brightnessFloor: 0.18,
    glowStrength: 3.0,
    colorPower: 1.2,
    colorVibration: 0.35,
    randSeed: new THREE.Vector2(1.9898, 4.1414),
    randMultiplier: 21573.0,
    noiseSmoothA: 3.0,
    noiseSmoothB: 2.0,
    fbmRotation: new THREE.Matrix2().set(-0.8, -0.6, 0.6, 0.8),
    fbmOctaves: [0.65, 0.3, 0.05, 0.0],
    fbmScales: [1.5, 1.2, 1.0],
    fbmNorm: 1.0,
    patternOffset1: new THREE.Vector2(0.0, -1.0),
    patternQMult: 5.0,
    patternOffset2: new THREE.Vector2(1.7, 8.0),
    patternFinalMult: 3.5,
  },

  oxytocin: {
    uvScale: 3.5,
    timeSpeed: 0.045,
    flowDirection: new THREE.Vector2(0.06, -0.02),
    mouseRadius: 0.5,
    mouseStrength: 0.3,
    baseColor: "#c93a3a",
    secondaryColor: "#f2b40c",
    glowColor: "#FF1493",
    colorSeparation: 0.17,
    colorSharpness: 0.3,
    brightnessFloor: 0.35,
    glowStrength: 2.5,
    colorPower: 1.4,
    colorVibration: 0.1,
    randSeed: new THREE.Vector2(6.289, 2.471),
    randMultiplier: 62458.2341,
    noiseSmoothA: 3.8,
    noiseSmoothB: 2.8,
    fbmRotation: new THREE.Matrix2().set(0.72, -0.58, 0.58, 0.72),
    fbmOctaves: [0.5, 0.3, 0.15, 0.05],
    fbmScales: [2.1, 2.05, 2.15],
    fbmNorm: 0.92,
    patternOffset1: new THREE.Vector2(0.0, 0.0),
    patternQMult: 4.8,
    patternOffset2: new THREE.Vector2(2.4, 7.9),
    patternFinalMult: 2.3,
  },

  serotonin: {
    uvScale: 2.0,
    timeSpeed: 0.03,
    flowDirection: new THREE.Vector2(-0.03, -0.015),
    mouseRadius: 0.5,
    mouseStrength: 0.3,
    baseColor: "#3b9c9c",
    secondaryColor: "#00A86B",
    glowColor: "#1a0d33",
    colorSeparation: 0.6,
    colorSharpness: 0.3,
    brightnessFloor: 0.35,
    glowStrength: 2.0,
    colorPower: 1.2,
    colorVibration: 0.4,
    randSeed: new THREE.Vector2(3.7124, 7.1524),
    randMultiplier: 43758.5453,
    noiseSmoothA: 3.5,
    noiseSmoothB: 2.5,
    fbmRotation: new THREE.Matrix2().set(0.7, -0.3, 0.3, 0.7),
    fbmOctaves: [0.5, 0.3, 0.15, 0.05],
    fbmScales: [2.1, 2.2, 2.0],
    fbmNorm: 0.95,
    patternOffset1: new THREE.Vector2(0.0, 0.0),
    patternQMult: 5.5,
    patternOffset2: new THREE.Vector2(2.5, 8.0),
    patternFinalMult: 2.8,
  },
};

export function getSharedUniforms(
  type: ShaderType
): THREE.ShaderMaterial["uniforms"] {
  const c = shaderUniformConfigs[type];

  return {
    u_time: { value: 0 },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },

    u_uvScale: { value: c.uvScale },
    u_timeSpeed: { value: c.timeSpeed },
    u_flowDirection: { value: c.flowDirection },

    u_mouseRadius: { value: c.mouseRadius },
    u_mouseStrength: { value: c.mouseStrength },

    u_baseColor: { value: new THREE.Color(c.baseColor) },
    u_secondaryColor: { value: new THREE.Color(c.secondaryColor) },
    u_glowColor: { value: new THREE.Color(c.glowColor) },

    u_colorSeparation: { value: c.colorSeparation },
    u_colorSharpness: { value: c.colorSharpness },
    u_brightnessFloor: { value: c.brightnessFloor },
    u_glowStrength: { value: c.glowStrength },

    u_colorPower: { value: c.colorPower },
    u_colorVibration: { value: c.colorVibration },

    u_randSeed: { value: c.randSeed },
    u_randMultiplier: { value: c.randMultiplier },

    u_noiseSmoothA: { value: c.noiseSmoothA },
    u_noiseSmoothB: { value: c.noiseSmoothB },

    u_fbmRotation: { value: c.fbmRotation },
    u_fbmOctave1: { value: c.fbmOctaves[0] },
    u_fbmOctave2: { value: c.fbmOctaves[1] },
    u_fbmOctave3: { value: c.fbmOctaves[2] },
    u_fbmOctave4: { value: c.fbmOctaves[3] },

    u_fbmScale1: { value: c.fbmScales[0] },
    u_fbmScale2: { value: c.fbmScales[1] },
    u_fbmScale3: { value: c.fbmScales[2] },
    u_fbmNorm: { value: c.fbmNorm },

    u_patternOffset1: { value: c.patternOffset1 },
    u_patternQMult: { value: c.patternQMult },
    u_patternOffset2: { value: c.patternOffset2 },
    u_patternFinalMult: { value: c.patternFinalMult },

    u_flipY: { value: 0 },
    u_useAspect: { value: 1 },
  };
}

interface ShaderMaterialConfig extends Partial<THREE.ShaderMaterial> {
  uniforms: THREE.ShaderMaterial["uniforms"] & {
    u_resolution: THREE.IUniform<any>;
    u_flipY?: THREE.IUniform<number>;
    u_useAspect?: THREE.IUniform<number>;
  };
}

export const getDopamineShaderMaterial = (
  config: ShaderMaterialConfig
): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      ...getSharedUniforms("dopamine"),
      u_turbulence: { value: 0.3 },
      u_directionalWarp: { value: 0.2 },
      ...(config.uniforms as THREE.ShaderMaterial["uniforms"]),
    },
    transparent: false,
    ...omit(config, "uniforms"),
  });
};

export const getOxytocinShaderMaterial = (
  config: ShaderMaterialConfig
): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      ...getSharedUniforms("oxytocin"),
      u_turbulence: { value: 0.3 },
      u_directionalWarp: { value: 0.2 },
      ...(config.uniforms as THREE.ShaderMaterial["uniforms"]),
    },
    transparent: false,
    ...omit(config, "uniforms"),
  });
};

export const getSerotoninShaderMaterial = (
  config: ShaderMaterialConfig
): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: serotoninFragmentShader,
    uniforms: {
      ...getSharedUniforms("serotonin"),
      u_displacementMult: { value: 1.8 },
      ...(config.uniforms as THREE.ShaderMaterial["uniforms"]),
    },
    transparent: false,
    ...omit(config, "uniforms"),
  });
};
