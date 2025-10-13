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
uniform vec2 u_flowDirection;  // ✅ Added

// Mouse
uniform float u_mouseRadius;
uniform float u_mouseStrength;

// Colors
uniform vec3 u_baseColor;
uniform vec3 u_glowColor;
uniform float u_displacementMult;
uniform float u_glowStrength;

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

    // ✅ Apply directional flow
    uv += u_flowDirection * u_time;

    vec2 mousePos = u_mouse;
    mousePos.x *= aspect;
    float mouseDistance = length(mousePos - vec2(v_uv.x * aspect, v_uv.y));
    float mouseInfluence = smoothstep(u_mouseRadius, 0.0, mouseDistance) * u_mouseStrength;

    float displacement = pattern(uv, mouseInfluence);
    displacement = mix(displacement, displacement * 1.5, mouseInfluence);

    vec4 color = vec4(displacement * u_displacementMult * u_baseColor, 1.0);
    color.rgb += u_glowColor * mouseInfluence * u_glowStrength;

    gl_FragColor = vec4(color.rgb, 1.0);
}
`;

export const SerotoninPlane = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size, mouse, clock, viewport } = useThree();

    const controls = useControls('Serotonin Shader', {
        Animation: folder({
            timeSpeed: { value: 0.08, min: 0, max: 1, step: 0.01 },
            uvScale: { value: 4.5, min: 0.1, max: 10, step: 0.1 },
            flowDirectionX: { value: 0.0, min: -1, max: 1, step: 0.01, label: 'Flow X' },  // ✅ Added
            flowDirectionY: { value: 0.0, min: -1, max: 1, step: 0.01, label: 'Flow Y' },  // ✅ Added
        }),

        Mouse: folder({
            enableMouse: { value: false },
            mouseRadius: { value: 0.5, min: 0, max: 2, step: 0.01 },
            mouseStrength: { value: 0.3, min: 0, max: 2, step: 0.01 },
        }),

        Colors: folder({
            baseColor: { value: '#a5c1e8', label: 'Base Color' },
            glowColor: { value: '#1a0d33', label: 'Glow Color' },
            displacementMult: { value: 1.2, min: 0, max: 5, step: 0.1 },
            glowStrength: { value: 2.0, min: 0, max: 10, step: 0.1 },
        }),

        'Rand Function': folder({
            randSeedX: { value: 1.9898, min: 0, max: 10, step: 0.0001 },
            randSeedY: { value: 4.1414, min: 0, max: 10, step: 0.0001 },
            randMultiplier: { value: 43758.5453, min: 0, max: 100000, step: 0.0001 },
        }),

        'Noise Function': folder({
            noiseSmoothA: { value: 3.0, min: 0, max: 10, step: 0.1 },
            noiseSmoothB: { value: 2.0, min: 0, max: 10, step: 0.1 },
        }),

        'FBM Rotation': folder({
            m00: { value: 0.8, min: -2, max: 2, step: 0.01 },
            m01: { value: -0.6, min: -2, max: 2, step: 0.01 },
            m10: { value: 0.6, min: -2, max: 2, step: 0.01 },
            m11: { value: 0.8, min: -2, max: 2, step: 0.01 },
        }),

        'FBM Octaves': folder({
            octave1: { value: 0.5, min: 0, max: 1, step: 0.01 },
            octave2: { value: 0.25, min: 0, max: 1, step: 0.01 },
            octave3: { value: 0.125, min: 0, max: 1, step: 0.01 },
            octave4: { value: 0.0625, min: 0, max: 1, step: 0.01 },
        }),

        'FBM Scales': folder({
            scale1: { value: 2.02, min: 0, max: 10, step: 0.01 },
            scale2: { value: 2.03, min: 0, max: 10, step: 0.01 },
            scale3: { value: 2.01, min: 0, max: 10, step: 0.01 },
            fbmNorm: { value: 0.769, min: 0.1, max: 2, step: 0.001 },
        }),

        'Pattern Function': folder({
            patternOffset1X: { value: 0.0, min: -10, max: 10, step: 0.1 },
            patternOffset1Y: { value: 0.0, min: -10, max: 10, step: 0.1 },
            patternQMult: { value: 4.0, min: 0, max: 10, step: 0.1 },
            patternOffset2X: { value: 1.7, min: -10, max: 10, step: 0.1 },
            patternOffset2Y: { value: 9.2, min: -10, max: 10, step: 0.1 },
            patternFinalMult: { value: 1.76, min: 0, max: 5, step: 0.01 },
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
                baseColor: controls.baseColor,
                glowColor: controls.glowColor,
                displacementMult: controls.displacementMult,
                glowStrength: controls.glowStrength,
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

                u_uvScale: { value: 4.5 },
                u_timeSpeed: { value: 0.15 },
                u_flowDirection: { value: new THREE.Vector2(0.0, 0.0) },  // ✅ Added

                u_mouseRadius: { value: 0.5 },
                u_mouseStrength: { value: 0.3 },

                u_baseColor: { value: new THREE.Color('#ff33ff') },
                u_glowColor: { value: new THREE.Color('#1a0d33') },
                u_displacementMult: { value: 1.2 },
                u_glowStrength: { value: 2.0 },

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
            },
            transparent: false
        });

        console.timeEnd('Material: Init took:')
        return mat;
    });

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

        material.uniforms.u_uvScale.value = controls.uvScale;
        material.uniforms.u_timeSpeed.value = controls.timeSpeed;
        material.uniforms.u_flowDirection.value.set(controls.flowDirectionX, controls.flowDirectionY);

        // Mouse
        material.uniforms.u_mouseRadius.value = controls.mouseRadius;
        material.uniforms.u_mouseStrength.value = controls.enableMouse ? controls.mouseStrength : 0;

        // Colors
        material.uniforms.u_baseColor.value.set(controls.baseColor);
        material.uniforms.u_glowColor.value.set(controls.glowColor);
        material.uniforms.u_displacementMult.value = controls.displacementMult;
        material.uniforms.u_glowStrength.value = controls.glowStrength;

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