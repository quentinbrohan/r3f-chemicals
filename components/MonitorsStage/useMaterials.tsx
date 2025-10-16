import { useFrame, useThree } from '@react-three/fiber';
import { folder, useControls } from 'leva';
import { useState } from 'react';
import * as THREE from 'three';
import { updateUniformsFromControls } from '../chemicals/shaders/helper';
import { getDopamineShaderMaterial, getOxytocinShaderMaterial, getSerotoninShaderMaterial } from '../chemicals/shaders/shaderMaterials';


const MONITOR_DIMENSIONS = {
    WIDTH: 2.12,
    HEIGHT: 3.29
}

export const useMaterials = () => {
    const { size, mouse, clock } = useThree();

    const [dopamineMaterial] = useState<THREE.ShaderMaterial>(() => {
        const mat = getDopamineShaderMaterial({
            uniforms: {
                u_resolution: { value: new THREE.Vector2(MONITOR_DIMENSIONS.WIDTH, MONITOR_DIMENSIONS.HEIGHT) },
                u_flipY: {value: 0},
                u_useAspect: {value: 0},
            },
            side: THREE.DoubleSide,

        });
        return mat;
    });
    const [oxytocinMaterial] = useState<THREE.ShaderMaterial>(() => {
        const mat = getOxytocinShaderMaterial({
            uniforms: {
                u_resolution: { value: new THREE.Vector2(MONITOR_DIMENSIONS.WIDTH, MONITOR_DIMENSIONS.HEIGHT) },
                u_flipY: {value: 1},
                u_useAspect: {value: 0},

            },
            side: THREE.DoubleSide,
        });
        return mat;
    });
    const [serotoninMaterial] = useState<THREE.ShaderMaterial>(() => {
        const mat = getSerotoninShaderMaterial({
            uniforms: {
                u_resolution: { value: new THREE.Vector2(MONITOR_DIMENSIONS.WIDTH, MONITOR_DIMENSIONS.HEIGHT) },
                u_flipY: {value: 1},
                u_useAspect: {value: 0},

            },
            side: THREE.DoubleSide,
        });
        return mat;
    });


    const [dopamineControls, _setControls] = useControls('Dopamine Shader', () => ({
        Animation: folder({
            uvScale: { value: 0.55, min: 0.1, max: 10, step: 0.1 },
            timeSpeed: { value: 0.06, min: 0, max: 0.5, step: 0.01 },
            flowDirectionX: { value: -0.08, min: -1, max: 1, step: 0.01 },
            flowDirectionY: { value: -0.02, min: -1, max: 1, step: 0.01 },
        }),

        Mouse: folder({
            enableMouse: { value: false },
            mouseRadius: { value: 0.5, min: 0, max: 1, step: 0.01 },
            mouseStrength: { value: 0.3, min: 0, max: 1, step: 0.01 },
        }),

        Colors: folder({
            baseColor: { value: '#ffb347', label: 'Base Color (Blue)' },
            secondaryColor: { value: '#6e1e96', label: 'Secondary Color (Purple)' },
            glowColor: { value: '#ffb347' },
            colorSeparation: { value: 0.38, min: 0, max: 1, step: 0.01 },
            colorSharpness: { value: 0.15, min: 0, max: 1, step: 0.01 },
            brightnessFloor: { value: 0.18, min: 0, max: 1, step: 0.01 },
            glowStrength: { value: 3.0, min: 0, max: 10, step: 0.1 },
            displacementMult: { value: 1.6, min: 0, max: 5, step: 0.1 },
        }),

        'New Effects': folder({
            colorPower: { value: 1.2, min: 0.1, max: 3, step: 0.1, label: 'Color Power (exponential)' },
            colorVibration: { value: 0.35, min: 0, max: 1, step: 0.01, label: 'Color Vibration' },
            turbulence: { value: 0.4, min: 0, max: 1, step: 0.01, label: 'Turbulence Strength' },
            directionalWarp: { value: 0.18, min: 0, max: 1, step: 0.01 },
        }),

        'Rand Function': folder({
            randSeedX: { value: 1.9898, min: 0, max: 20, step: 0.0001 },
            randSeedY: { value: 4.1414, min: 0, max: 20, step: 0.0001 },
            randMultiplier: { value: 21573.00, min: 0, max: 100000, step: 0.0001 },
        }),

        'Noise Function': folder({
            smoothA: { value: 3.0, min: 0, max: 10, step: 0.1 },
            smoothB: { value: 2.0, min: 0, max: 10, step: 0.1 },
        }),

        'FBM Rotation': folder({
            m00: { value: -0.8, min: -2, max: 2, step: 0.01 },
            m01: { value: -0.6, min: -2, max: 2, step: 0.01 },
            m10: { value: 0.6, min: -2, max: 2, step: 0.01 },
            m11: { value: 0.8, min: -2, max: 2, step: 0.01 },
        }),

        'FBM Octaves': folder({
            octave1: { value: 0.65, min: 0, max: 1, step: 0.01 },
            octave2: { value: 0.3, min: 0, max: 1, step: 0.01 },
            octave3: { value: 0.05, min: 0, max: 1, step: 0.01 },
            octave4: { value: 0.0, min: 0, max: 1, step: 0.01 },
        }),

        'FBM Scales': folder({
            scale1: { value: 1.5, min: 1, max: 5, step: 0.01 },
            scale2: { value: 1.2, min: 1, max: 5, step: 0.01 },
            scale3: { value: 1.0, min: 1, max: 5, step: 0.01 },
            fbmNorm: { value: 1.0, min: 0.1, max: 2, step: 0.01 },
        }),

        'Pattern Function': folder({
            patternOffset1X: { value: 0.0, min: -10, max: 10, step: 0.1 },
            patternOffset1Y: { value: -1.0, min: -10, max: 10, step: 0.1 },
            patternQMult: { value: 5.0, min: 0, max: 10, step: 0.1 },
            patternOffset2X: { value: 1.7, min: -10, max: 10, step: 0.1 },
            patternOffset2Y: { value: 8.0, min: -10, max: 10, step: 0.1 },
            patternFinalMult: { value: 3.5, min: 0, max: 5, step: 0.1 },
        }),
    }));

    const oxytocinControls = useControls('Oxytocin Shader', {
        'Animation': folder({
            uvScale: { value: 3.5, min: 0.5, max: 10, step: 0.1 },
            timeSpeed: { value: 0.045, min: 0, max: 0.5, step: 0.01 },
            flowDirectionX: { value: 0.06, min: -0.5, max: 0.5, step: 0.01 },
            flowDirectionY: { value: -0.02, min: -0.5, max: 0.5, step: 0.01 },
        }),
        'Mouse': folder({
            enableMouse: { value: false },
            mouseRadius: { value: 0.5, min: 0, max: 1, step: 0.01 },
            mouseStrength: { value: 0.3, min: 0, max: 1, step: 0.01 },
        }),
        'Colors': folder({
            baseColor: { value: '#c93a3a' },
            secondaryColor: { value: '#f2b40c' },
            colorSeparation: { value: 0.17, min: 0, max: 1, step: 0.01 },
            colorSharpness: { value: 0.3, min: 0, max: 0.5, step: 0.01 },
            brightnessFloor: { value: 0.35, min: 0, max: 1, step: 0.01 },
            glowColor: { value: '#FF1493' },
            glowStrength: { value: 2.5, min: 0, max: 5, step: 0.1 },
        }),
        'Effects': folder({
            turbulence: { value: 0.35, min: 0, max: 1, step: 0.01 },
            directionalWarp: { value: 0.26, min: 0, max: 1, step: 0.01 },
            colorPower: { value: 1.4, min: 0.5, max: 3, step: 0.1 },
            colorVibration: { value: 0.1, min: 0, max: 0.5, step: 0.01 },
            displacementMult: { value: 1.8, min: 0, max: 5, step: 0.1 },
        }),
        'Rand Function': folder({
            randSeedX: { value: 6.289, min: 0, max: 20, step: 0.0001 },
            randSeedY: { value: 2.471, min: 0, max: 20, step: 0.0001 },
            randMultiplier: { value: 62458.2341, min: 1000, max: 100000, step: 0.0001 },
        }),
        'Noise Function': folder({
            smoothA: { value: 3.8, min: 0, max: 10, step: 0.1 },
            smoothB: { value: 2.8, min: 0, max: 10, step: 0.1 },
        }),
        'FBM Rotation': folder({
            m00: { value: 0.72, min: -2, max: 2, step: 0.01 },
            m01: { value: -0.58, min: -2, max: 2, step: 0.01 },
            m10: { value: 0.58, min: -2, max: 2, step: 0.01 },
            m11: { value: 0.72, min: -2, max: 2, step: 0.01 },
        }),
        'FBM Octaves': folder({
            octave1: { value: 0.50, min: 0, max: 1, step: 0.01 },
            octave2: { value: 0.3, min: 0, max: 1, step: 0.01 },
            octave3: { value: 0.15, min: 0, max: 1, step: 0.01 },
            octave4: { value: 0.05, min: 0, max: 1, step: 0.01 },
        }),
        'FBM Scales': folder({
            scale1: { value: 2.1, min: 1, max: 5, step: 0.01 },
            scale2: { value: 2.05, min: 1, max: 5, step: 0.01 },
            scale3: { value: 2.15, min: 1, max: 5, step: 0.01 },
            fbmNorm: { value: 0.92, min: 0.1, max: 2, step: 0.01 },
        }),
        'Pattern Function': folder({
            patternOffset1X: { value: 0.0, min: -10, max: 10, step: 0.1 },
            patternOffset1Y: { value: 0.0, min: -10, max: 10, step: 0.1 },
            patternQMult: { value: 4.8, min: 0, max: 10, step: 0.1 },
            patternOffset2X: { value: 2.4, min: -10, max: 10, step: 0.1 },
            patternOffset2Y: { value: 7.9, min: -10, max: 10, step: 0.1 },
            patternFinalMult: { value: 2.3, min: 0, max: 5, step: 0.01 },
        }),
    });

    const serotoninControls = useControls('Serotonin Shader', {
        Animation: folder({
            timeSpeed: { value: 0.03, min: 0, max: 1, step: 0.01 },
            uvScale: { value: 2.0, min: 0.1, max: 10, step: 0.1 },
            flowDirectionX: { value: -0.03, min: -1, max: 1, step: 0.01, label: 'Flow X' },
            flowDirectionY: { value: -0.015, min: -1, max: 1, step: 0.01, label: 'Flow Y' },
        }),

        Mouse: folder({
            enableMouse: { value: false },
            mouseRadius: { value: 0.5, min: 0, max: 2, step: 0.01 },
            mouseStrength: { value: 0.3, min: 0, max: 1, step: 0.01 },
        }),

        Colors: folder({
            baseColor: { value: '#3b9c9c', label: 'Base Color' },
            secondaryColor: { value: '#00A86B', label: 'Secondary Color' },
            colorSeparation: { value: 0.6, min: 0, max: 1, step: 0.01, label: 'Color Split Point' },
            colorSharpness: { value: 0.3, min: 0.01, max: 0.5, step: 0.01, label: 'Blend Sharpness' },
            displacementMult: { value: 1.6, min: 0, max: 5, step: 0.1 },
            glowColor: { value: '#1a0d33', label: 'Glow Color' },
            brightnessFloor: { value: 0.35, min: 0, max: 1, step: 0.05, label: 'Min Brightness' }, // ✅ NEW
            glowStrength: { value: 2.0, min: 0, max: 5, step: 0.1 },
        }),


        'New Effects': folder({
            colorPower: { value: 1.2, min: 0.1, max: 3, step: 0.1, label: 'Color Power (exponential)' },
            colorVibration: { value: 0.4, min: 0, max: 1, step: 0.01, label: 'Color Vibration' },
        }),

        'Rand Function': folder({
            randSeedX: { value: 3.7124, min: 0, max: 10, step: 0.0001 },
            randSeedY: { value: 7.1524, min: 0, max: 10, step: 0.0001 },
            randMultiplier: { value: 43758.5453, min: 0, max: 100000, step: 0.0001 },
        }),

        'Noise Function': folder({
            smoothA: { value: 3.5, min: 0, max: 10, step: 0.1 },
            smoothB: { value: 2.5, min: 0, max: 10, step: 0.1 },
        }),

        'FBM Rotation Matrix': folder({
            m00: { value: 0.7, min: -2, max: 2, step: 0.01 },
            m01: { value: -0.3, min: -2, max: 2, step: 0.01 },
            m10: { value: 0.3, min: -2, max: 2, step: 0.01 },
            m11: { value: 0.7, min: -2, max: 2, step: 0.01 },
        }),

        'FBM Octaves': folder({
            octave1: { value: 0.50, min: 0, max: 1, step: 0.01 },
            octave2: { value: 0.30, min: 0, max: 1, step: 0.01 },
            octave3: { value: 0.15, min: 0, max: 1, step: 0.01 },
            octave4: { value: 0.05, min: 0, max: 1, step: 0.01 },
        }),

        'FBM Scales': folder({
            scale1: { value: 2.1, min: 1, max: 5, step: 0.01 },
            scale2: { value: 2.2, min: 1, max: 5, step: 0.01 },
            scale3: { value: 2.0, min: 1, max: 5, step: 0.01 },
            fbmNorm: { value: 0.95, min: 0.1, max: 2, step: 0.01 },
        }),

        'Pattern Function': folder({
            patternOffset1X: { value: 0.0, min: -10, max: 10, step: 0.1 },
            patternOffset1Y: { value: 0.0, min: -10, max: 10, step: 0.1 },
            patternQMult: { value: 5.5, min: 0, max: 10, step: 0.1 },
            patternOffset2X: { value: 2.5, min: -10, max: 10, step: 0.1 },
            patternOffset2Y: { value: 8.0, min: -10, max: 10, step: 0.1 },
            patternFinalMult: { value: 2.8, min: 0, max: 5, step: 0.1 },
        }),
    });

    useFrame(() => {
        const data = [
            {
                material: dopamineMaterial,
                controls: dopamineControls
            },
            {
                material: oxytocinMaterial,
                controls: oxytocinControls
            },
            {
                material: serotoninMaterial,
                controls: serotoninControls
            },
        ];
        data.forEach((hormone) => {
            updateUniformsFromControls({
                material: hormone.material,
                controls: hormone.controls,
                clock,
                mouse,
                size,
            });
        });
    });

    return {
        dopamineMaterial,
        oxytocinMaterial,
        serotoninMaterial,
    };

};
