'use client'

import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from 'leva';
import { useRef, useState } from "react";
import * as THREE from "three";
import { getOxytocinShaderMaterial } from "./shaders/shaderMaterials";

export const OxytocinPlane = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size, mouse, clock, viewport } = useThree();

    const controls = useControls('Shaders/Oxytocin', {
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
        'Export': folder({
            'Copy Values': button(() => {
                const values = JSON.stringify(controls, null, 2);
                navigator.clipboard.writeText(values);
                console.log('Copied to clipboard:', values);
            }),
        }),
    });

    const [material] = useState<THREE.ShaderMaterial>(() => {
        console.log('Material: Initing...')
        console.time('Material: Init took:')

        const mat = getOxytocinShaderMaterial({
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
        material.uniforms.u_colorSeparation.value = controls.colorSeparation;
        material.uniforms.u_colorSharpness.value = controls.colorSharpness;
        material.uniforms.u_brightnessFloor.value = controls.brightnessFloor;
        material.uniforms.u_glowStrength.value = controls.glowStrength;
        material.uniforms.u_colorPower.value = controls.colorPower;
        material.uniforms.u_colorVibration.value = controls.colorVibration;
        material.uniforms.u_turbulence.value = controls.turbulence;
        material.uniforms.u_directionalWarp.value = controls.directionalWarp;

        // Rand function
        material.uniforms.u_randSeed.value.set(controls.randSeedX, controls.randSeedY);
        material.uniforms.u_randMultiplier.value = controls.randMultiplier;

        // Noise function
        material.uniforms.u_noiseSmoothA.value = controls.smoothA;
        material.uniforms.u_noiseSmoothB.value = controls.smoothB;

        // FBM rotation matrix
        material.uniforms.u_fbmRotation.value.set(
            controls.m00, controls.m10,
            controls.m01, controls.m11
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