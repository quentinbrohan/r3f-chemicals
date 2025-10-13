'use client'

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useControls, folder, button } from 'leva';

const vertexShader = /* glsl */ `
varying vec2 v_uv;

void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision mediump float;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

// Animation
uniform float u_uvScale;
uniform float u_timeSpeed;
uniform vec2 u_flowDirection;

// Mouse
uniform float u_mouseRadius;
uniform float u_mouseStrength;
uniform bool u_enableMouse;

// Colors
uniform vec3 u_color1;
uniform float u_color1Intensity;
uniform vec3 u_color2;
uniform float u_color2Intensity;
uniform float u_colorSeparation;
uniform float u_colorSharpness;

// Rand function
uniform vec2 u_randSeed;
uniform float u_randMultiplier;

// Noise function
uniform float u_noiseSmoothA;
uniform float u_noiseSmoothB;

// FBM function
uniform mat2 u_fbmRotation;
uniform float u_fbmOctave1;
uniform float u_fbmOctave2;
uniform float u_fbmOctave3;
uniform float u_fbmOctave4;
uniform float u_fbmScale1;
uniform float u_fbmScale2;
uniform float u_fbmScale3;
uniform float u_fbmNorm;

// Pattern function
uniform vec2 u_patternOffset1;
uniform float u_patternQMult;
uniform vec2 u_patternOffset2;
uniform float u_patternFinalMult;

varying vec2 v_uv;

float rand(vec2 n) {
    return fract(sin(dot(n, u_randSeed)) * u_randMultiplier);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(u_noiseSmoothA - u_noiseSmoothB*u);

    float res = mix(
        mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
        mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x),
        u.y);
    return res*res;
}

float fbm(in vec2 p) {
    float f = 0.0;
    f += u_fbmOctave1*noise(p); p = u_fbmRotation*p*u_fbmScale1;
    f += u_fbmOctave2*noise(p); p = u_fbmRotation*p*u_fbmScale2;
    f += u_fbmOctave3*noise(p); p = u_fbmRotation*p*u_fbmScale3;
    f += u_fbmOctave4*noise(p);

    return f/u_fbmNorm;
}

float pattern(in vec2 p, float mouseInfluence) {
    vec2 q = vec2(fbm(p + u_patternOffset1));
    vec2 r = vec2(fbm(p + u_patternQMult*q + u_patternOffset2 + mouseInfluence));
    r += u_time * u_timeSpeed;
    return fbm(p + u_patternFinalMult*r);
}

void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    uv *= u_uvScale;

    // Add directional flow
    uv += u_flowDirection * u_time;

    // Mouse interaction (optional)
    float mouseInfluence = 0.0;
    if (u_enableMouse) {
        vec2 mousePos = u_mouse;
        mousePos.x *= aspect;
        float mouseDistance = length(mousePos - vec2(v_uv.x * aspect, v_uv.y));
        mouseInfluence = smoothstep(u_mouseRadius, 0.0, mouseDistance) * u_mouseStrength;
    }

    // Calculate displacement using original pattern function
    float displacement = pattern(uv, mouseInfluence);
    displacement = mix(displacement, displacement * 1.5, mouseInfluence);

    // Blend colors based on displacement value
    float colorMask = smoothstep(u_colorSeparation, u_colorSeparation + u_colorSharpness, displacement);

    // Apply intensity separately to each color
    vec3 color1 = u_color1 * u_color1Intensity;
    vec3 color2 = u_color2 * u_color2Intensity;

    // Blend between the two colors
    vec3 blendedColor = mix(color1, color2, colorMask);

    // Apply displacement as a visibility mask (not multiplier)
    float mask = smoothstep(0.0, 0.3, displacement);

    gl_FragColor = vec4(blendedColor * mask, 1.0);
}
`;

export const DopaminePlane = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size, mouse, clock, viewport, gl, scene, camera } = useThree();

    const controls = useControls('Dopamine Shader', {
        'Animation': folder({
            timeSpeed: { value: 0.05, min: 0, max: 1, step: 0.01 },
            uvScale: { value: 2.7, min: 0.1, max: 10, step: 0.1 },
            flowDirectionX: { value: -0.01, min: -1, max: 1, step: 0.01, label: 'Flow X (Wind)' },
            flowDirectionY: { value: -0.01, min: -1, max: 1, step: 0.01, label: 'Flow Y' },
        }),

        'Colors': folder({
            color1: { value: '#ae6def', label: 'Color 1 (Water)' },
            color1Intensity: { value: 0.7, min: 0, max: 3, step: 0.1, label: 'Color 1 Intensity' },
            color2: { value: '#db996e', label: 'Color 2 (Liquid)' },
            color2Intensity: { value: 1.4, min: 0, max: 3, step: 0.1, label: 'Color 2 Intensity' },
            colorSeparation: { value: 0.36, min: -1, max: 1, step: 0.01, label: 'Color Separation' },
            colorSharpness: { value: 0.34, min: 0.01, max: 0.5, step: 0.01, label: 'Color Sharpness' },
        }),

        'Mouse': folder({
            enableMouse: { value: true, label: 'Enable Mouse' },
            mouseRadius: { value: 0.5, min: 0, max: 2, step: 0.05 },
            mouseStrength: { value: 0.3, min: 0, max: 1, step: 0.05 },
        }),

        'Rand Function': folder({
            randSeedX: { value: 1.9898, min: 0, max: 10, step: 0.0001, label: 'Seed X' },
            randSeedY: { value: 4.1414, min: 0, max: 10, step: 0.0001, label: 'Seed Y' },
            randMultiplier: { value: 43758.5453, min: 1000, max: 100000, step: 0.0001 },
        }),

        'Noise Function': folder({
            noiseSmoothA: { value: 3.0, min: 0, max: 10, step: 0.1, label: 'Smooth A' },
            noiseSmoothB: { value: 2.0, min: 0, max: 10, step: 0.1, label: 'Smooth B' },
        }),

        'FBM Function': folder({
            fbmRotation: folder({
                m00: { value: 0.8, min: -2, max: 2, step: 0.01, label: '[0,0]' },
                m01: { value: -0.6, min: -2, max: 2, step: 0.01, label: '[0,1]' },
                m10: { value: 0.6, min: -2, max: 2, step: 0.01, label: '[1,0]' },
                m11: { value: 0.8, min: -2, max: 2, step: 0.01, label: '[1,1]' },
            }),
            octaves: folder({
                octave1: { value: 0.5, min: 0, max: 1, step: 0.01, label: 'Octave 1 Weight' },
                octave2: { value: 0.25, min: 0, max: 1, step: 0.01, label: 'Octave 2 Weight' },
                octave3: { value: 0.125, min: 0, max: 1, step: 0.01, label: 'Octave 3 Weight' },
                octave4: { value: 0.0625, min: 0, max: 1, step: 0.01, label: 'Octave 4 Weight' },
            }),
            scales: folder({
                scale1: { value: 2.02, min: 1, max: 5, step: 0.01, label: 'Scale 1' },
                scale2: { value: 2.03, min: 1, max: 5, step: 0.01, label: 'Scale 2' },
                scale3: { value: 2.01, min: 1, max: 5, step: 0.01, label: 'Scale 3' },
            }),
            fbmNorm: { value: 0.769, min: 0.1, max: 2, step: 0.001, label: 'Normalization' },
        }),

        'Pattern Function': folder({
            patternOffset1X: { value: 0.0, min: -10, max: 10, step: 0.1, label: 'Offset 1 X' },
            patternOffset1Y: { value: 0.0, min: -10, max: 10, step: 0.1, label: 'Offset 1 Y' },
            patternQMult: { value: 4.0, min: 0, max: 10, step: 0.1, label: 'Q Multiplier' },
            patternOffset2X: { value: 1.7, min: -10, max: 10, step: 0.1, label: 'Offset 2 X' },
            patternOffset2Y: { value: 9.2, min: -10, max: 10, step: 0.1, label: 'Offset 2 Y' },
            patternFinalMult: { value: 1.76, min: 0, max: 5, step: 0.01, label: 'Final Multiplier' },
        }),

        'Export Values': button(() => {
            const values = {
                timeSpeed: controls.timeSpeed,
                uvScale: controls.uvScale,
                flowDirectionX: controls.flowDirectionX,
                flowDirectionY: controls.flowDirectionY,
                enableMouse: controls.enableMouse,
                mouseRadius: controls.mouseRadius,
                mouseStrength: controls.mouseStrength,
                color1: controls.color1,
                color1Intensity: controls.color1Intensity,
                color2: controls.color2,
                color2Intensity: controls.color2Intensity,
                colorSeparation: controls.colorSeparation,
                colorSharpness: controls.colorSharpness,
                randSeedX: controls.randSeedX,
                randSeedY: controls.randSeedY,
                randMultiplier: controls.randMultiplier,
                noiseSmoothA: controls.noiseSmoothA,
                noiseSmoothB: controls.noiseSmoothB,
                m00: controls.m00,
                m01: controls.m01,
                m10: controls.m10,
                m11: controls.m11,
                octave1: controls.octave1,
                octave2: controls.octave2,
                octave3: controls.octave3,
                octave4: controls.octave4,
                scale1: controls.scale1,
                scale2: controls.scale2,
                scale3: controls.scale3,
                fbmNorm: controls.fbmNorm,
                patternOffset1X: controls.patternOffset1X,
                patternOffset1Y: controls.patternOffset1Y,
                patternQMult: controls.patternQMult,
                patternOffset2X: controls.patternOffset2X,
                patternOffset2Y: controls.patternOffset2Y,
                patternFinalMult: controls.patternFinalMult,
            };

            navigator.clipboard.writeText(JSON.stringify(values, null, 2));
            console.log('Copied to clipboard:', values);
        }),

        'Screenshot': button(() => {
            gl.render(scene, camera);
            const dataURL = gl.domElement.toDataURL('image/png');
            const link = document.createElement('a');
            const now = new Date().toISOString();
            link.download = `dopamine-${now}.png`;
            link.href = dataURL;
            link.click();
        }),
    });

    const [material] = useState(() => {
        console.log('Material: Initing...')
        console.time('Material: Init took:')

        const mat = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
                u_resolution: { value: new THREE.Vector2(size.width, size.height) },

                // Animation
                u_uvScale: { value: 4.5 },
                u_timeSpeed: { value: 0.15 },
                u_flowDirection: { value: new THREE.Vector2(0.1, 0.0) },

                // Mouse
                u_mouseRadius: { value: 0.5 },
                u_mouseStrength: { value: 0.3 },
                u_enableMouse: { value: true },

                // Colors
                u_color1: { value: new THREE.Color('#ff33ff') },
                u_color1Intensity: { value: 1.0 },
                u_color2: { value: new THREE.Color('#00ffff') },
                u_color2Intensity: { value: 1.0 },
                u_colorSeparation: { value: 0.5 },
                u_colorSharpness: { value: 0.1 },

                // Rand function
                u_randSeed: { value: new THREE.Vector2(1.9898, 4.1414) },
                u_randMultiplier: { value: 43758.5453 },

                // Noise function
                u_noiseSmoothA: { value: 3.0 },
                u_noiseSmoothB: { value: 2.0 },

                // FBM function
                u_fbmRotation: { value: new THREE.Matrix2().set(0.8, -0.6, 0.6, 0.8) },
                u_fbmOctave1: { value: 0.5 },
                u_fbmOctave2: { value: 0.25 },
                u_fbmOctave3: { value: 0.125 },
                u_fbmOctave4: { value: 0.0625 },
                u_fbmScale1: { value: 2.02 },
                u_fbmScale2: { value: 2.03 },
                u_fbmScale3: { value: 2.01 },
                u_fbmNorm: { value: 0.769 },

                // Pattern function
                u_patternOffset1: { value: new THREE.Vector2(0.0, 0.0) },
                u_patternQMult: { value: 4.0 },
                u_patternOffset2: { value: new THREE.Vector2(1.7, 9.2) },
                u_patternFinalMult: { value: 1.76 },
            },
            transparent: false
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
        material.uniforms.u_color1.value.set(controls.color1);
        material.uniforms.u_color1Intensity.value = controls.color1Intensity;
        material.uniforms.u_color2.value.set(controls.color2);
        material.uniforms.u_color2Intensity.value = controls.color2Intensity;
        material.uniforms.u_colorSeparation.value = controls.colorSeparation;
        material.uniforms.u_colorSharpness.value = controls.colorSharpness;

        // Rand function
        material.uniforms.u_randSeed.value.set(controls.randSeedX, controls.randSeedY);
        material.uniforms.u_randMultiplier.value = controls.randMultiplier;

        // Noise function
        material.uniforms.u_noiseSmoothA.value = controls.noiseSmoothA;
        material.uniforms.u_noiseSmoothB.value = controls.noiseSmoothB;

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