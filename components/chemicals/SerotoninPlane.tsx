'use client'

import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from 'leva';
import { useRef, useState } from "react";
import * as THREE from "three";
import { getSerotoninShaderMaterial } from "./shaders/shaderMaterials";

export const SerotoninPlane = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size, mouse, clock, viewport } = useThree();

    const controls = useControls('Shaders/Serotonin', {
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
            brightnessFloor: { value: 0.35, min: 0, max: 1, step: 0.05, label: 'Min Brightness' },  // ✅ NEW
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

        'Export Values': button(() => {
            navigator.clipboard.writeText(JSON.stringify(controls, null, 2));
            console.log('Copied to clipboard:', controls);
        }),
    });

    const [material] = useState<THREE.ShaderMaterial>(() => {
        console.log('Material: Initing...')
        console.time('Material: Init took:')

        const mat = getSerotoninShaderMaterial({
            uniforms: {
                u_resolution: { value: new THREE.Vector2(size.width, size.height) },
            }
        });
        console.timeEnd('Material: Init took:')
        return mat;
    });

    // Update uniforms from Leva controls
    useFrame(() => {
        material.uniforms.u_time.value = clock.getElapsedTime();

        // Mouse
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
        material.uniforms.u_flowDirection.value.set(controls.flowDirectionX, controls.flowDirectionY);

        // Mouse
        material.uniforms.u_mouseRadius.value = controls.mouseRadius;
        material.uniforms.u_mouseStrength.value = controls.enableMouse ? controls.mouseStrength : 0;

        // Colors
        material.uniforms.u_baseColor.value.set(controls.baseColor);
        material.uniforms.u_secondaryColor.value.set(controls.secondaryColor);
        material.uniforms.u_glowColor.value.set(controls.glowColor);
        material.uniforms.u_displacementMult.value = controls.displacementMult;
        material.uniforms.u_brightnessFloor.value = controls.brightnessFloor;  // ✅ NEW
        material.uniforms.u_glowStrength.value = controls.glowStrength;
        material.uniforms.u_colorSeparation.value = controls.colorSeparation;
        material.uniforms.u_colorSharpness.value = controls.colorSharpness;

        material.uniforms.u_colorPower.value = controls.colorPower;
        material.uniforms.u_colorVibration.value = controls.colorVibration;

        // Rand function
        material.uniforms.u_randSeed.value.set(controls.randSeedX, controls.randSeedY);
        material.uniforms.u_randMultiplier.value = controls.randMultiplier;

        // Noise function
        material.uniforms.u_noiseSmoothA.value = controls.smoothA;
        material.uniforms.u_noiseSmoothB.value = controls.smoothB;

        // FBM rotation matrix
        material.uniforms.u_fbmRotation.value.set(
            controls.m00, controls.m01,
            controls.m10, controls.m11
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
        material.uniforms.u_patternOffset1.value.set(controls.patternOffset1X, controls.patternOffset1Y);
        material.uniforms.u_patternQMult.value = controls.patternQMult;
        material.uniforms.u_patternOffset2.value.set(controls.patternOffset2X, controls.patternOffset2Y);
        material.uniforms.u_patternFinalMult.value = controls.patternFinalMult;
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} material={material}>
            <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
        </mesh>
    )
};