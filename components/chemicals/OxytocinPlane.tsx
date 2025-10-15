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
uniform float u_uvScale;
uniform float u_timeSpeed;
uniform vec2 u_flowDirection;
uniform float u_mouseRadius;
uniform float u_mouseStrength;
uniform vec3 u_baseColor;
uniform vec3 u_secondaryColor;
uniform vec3 u_glowColor;
uniform float u_colorSeparation;
uniform float u_colorSharpness;
uniform float u_brightnessFloor;
uniform float u_colorPower;
uniform float u_colorVibration;
uniform float u_turbulence;
uniform float u_directionalWarp;
uniform float u_displacementMult;
uniform float u_glowStrength;

uniform vec2 u_randSeed;
uniform float u_randMultiplier;
uniform float u_noiseSmoothA;
uniform float u_noiseSmoothB;
uniform mat2 u_fbmRotation;
uniform float u_fbmOctave1;
uniform float u_fbmOctave2;
uniform float u_fbmOctave3;
uniform float u_fbmOctave4;
uniform float u_fbmScale1;
uniform float u_fbmScale2;
uniform float u_fbmScale3;
uniform float u_fbmNorm;
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
    f += u_fbmOctave1 * noise(p); p = u_fbmRotation * p * u_fbmScale1;
    f += u_fbmOctave2 * noise(p); p = u_fbmRotation * p * u_fbmScale2;
    f += u_fbmOctave3 * noise(p); p = u_fbmRotation * p * u_fbmScale3;
    f += u_fbmOctave4 * noise(p);

    return f / u_fbmNorm;
}

float pattern(in vec2 p, float mouseInfluence) {
    vec2 q = vec2(fbm(p + u_patternOffset1));
    vec2 r = vec2(fbm(p + u_patternQMult * q + u_patternOffset2 + mouseInfluence));
    r += u_time * u_timeSpeed;

    float turbulence = fbm(p * 2.0 + r * 0.5);
    r += turbulence * u_turbulence;

    vec2 warp = vec2(
        fbm(p + r * 1.5),
        fbm(p + r * 1.5 + vec2(5.2, 1.3))
    );
    r += warp * u_directionalWarp;

    return fbm(p + u_patternFinalMult * r);
}

void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    uv *= u_uvScale;
    uv += u_flowDirection * u_time;

    vec2 mousePos = u_mouse;
    mousePos.x *= aspect;
    float mouseDistance = length(mousePos - vec2(v_uv.x * aspect, v_uv.y));
    float mouseInfluence = smoothstep(u_mouseRadius, 0.0, mouseDistance) * u_mouseStrength;

    float displacement = pattern(uv, mouseInfluence);
    displacement = mix(displacement, displacement * 1.5, mouseInfluence);

    float displacementPow = pow(displacement, u_colorPower);

    vec3 blendedColor = mix(u_baseColor, u_secondaryColor,
        smoothstep(u_colorSeparation, u_colorSeparation + u_colorSharpness, displacementPow));

    float vibration = sin(u_time * 2.0 + displacement * 10.0) * 0.5 + 0.5;
    blendedColor *= 1.0 + vibration * u_colorVibration;

    float visibility = smoothstep(0.0, 0.3, displacement);
    vec3 finalColor = mix(blendedColor * u_brightnessFloor, blendedColor, visibility);

    finalColor += u_glowColor * mouseInfluence * u_glowStrength;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

export const OxytocinPlane = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size, mouse, clock, viewport } = useThree();

    const controls = useControls('Oxytocin Shader', {
        'Animation': folder({
            uvScale: { value: 3.0, min: 0.5, max: 10, step: 0.1 },
            timeSpeed: { value: 0.05, min: 0, max: 0.5, step: 0.01 },
            flowDirectionX: { value: 0.08, min: -0.5, max: 0.5, step: 0.01 },
            flowDirectionY: { value: 0.03, min: -0.5, max: 0.5, step: 0.01 },
        }),
        'Mouse': folder({
            enableMouse: { value: false },
            mouseRadius: { value: 0.5, min: 0, max: 1, step: 0.01 },
            mouseStrength: { value: 0.3, min: 0, max: 1, step: 0.01 },
        }),
        'Colors': folder({
            baseColor: { value: '#FF6B00' },
            secondaryColor: { value: '#8B00FF' },
            colorSeparation: { value: 0.5, min: 0, max: 1, step: 0.01 },
            colorSharpness: { value: 0.08, min: 0, max: 0.5, step: 0.01 },
            brightnessFloor: { value: 0.15, min: 0, max: 1, step: 0.01 },
            glowColor: { value: '#FF1493' },
            glowStrength: { value: 2.5, min: 0, max: 5, step: 0.1 },
        }),
        'Effects': folder({
            turbulence: { value: 0.4, min: 0, max: 1, step: 0.01 },
            directionalWarp: { value: 0.25, min: 0, max: 1, step: 0.01 },
            colorPower: { value: 1.3, min: 0.5, max: 3, step: 0.1 },
            colorVibration: { value: 0.15, min: 0, max: 0.5, step: 0.01 },
            displacementMult: { value: 1.6, min: 0, max: 5, step: 0.1 },
        }),
        'Rand Function': folder({
            randSeedX: { value: 1.9898, min: 0, max: 20, step: 0.0001 },
            randSeedY: { value: 4.1414, min: 0, max: 20, step: 0.0001 },
            randMultiplier: { value: 43758.5453, min: 1000, max: 100000, step: 0.0001 },
        }),
        'Noise Function': folder({
            smoothA: { value: 3.0, min: 0, max: 10, step: 0.1 },
            smoothB: { value: 2.0, min: 0, max: 10, step: 0.1 },
        }),
        'FBM Rotation': folder({
            m00: { value: 0.75, min: -2, max: 2, step: 0.01 },
            m01: { value: -0.65, min: -2, max: 2, step: 0.01 },
            m10: { value: 0.65, min: -2, max: 2, step: 0.01 },
            m11: { value: 0.75, min: -2, max: 2, step: 0.01 },
        }),
        'FBM Octaves': folder({
            octave1: { value: 0.50, min: 0, max: 1, step: 0.01 },
            octave2: { value: 0.28, min: 0, max: 1, step: 0.01 },
            octave3: { value: 0.16, min: 0, max: 1, step: 0.01 },
            octave4: { value: 0.08, min: 0, max: 1, step: 0.01 },
        }),
        'FBM Scales': folder({
            scale1: { value: 2.05, min: 1, max: 5, step: 0.01 },
            scale2: { value: 2.08, min: 1, max: 5, step: 0.01 },
            scale3: { value: 2.03, min: 1, max: 5, step: 0.01 },
            fbmNorm: { value: 0.85, min: 0.1, max: 2, step: 0.01 },
        }),
        'Pattern Function': folder({
            patternOffset1X: { value: 0.0, min: -10, max: 10, step: 0.1 },
            patternOffset1Y: { value: 0.0, min: -10, max: 10, step: 0.1 },
            patternQMult: { value: 4.5, min: 0, max: 10, step: 0.1 },
            patternOffset2X: { value: 2.0, min: -10, max: 10, step: 0.1 },
            patternOffset2Y: { value: 8.5, min: -10, max: 10, step: 0.1 },
            patternFinalMult: { value: 2.0, min: 0, max: 5, step: 0.01 },
        }),
        'Export': folder({
            'Copy Values': button(() => {
                const values = JSON.stringify(controls, null, 2);
                navigator.clipboard.writeText(values);
                console.log('Copied to clipboard:', values);
            }),
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

                u_uvScale: { value: 3.0 },
                u_timeSpeed: { value: 0.05 },
                u_flowDirection: { value: new THREE.Vector2(0.08, 0.03) },

                u_mouseRadius: { value: 0.5 },
                u_mouseStrength: { value: 0.3 },

                u_baseColor: { value: new THREE.Color('#FF6B00') },
                u_secondaryColor: { value: new THREE.Color('#8B00FF') },
                u_glowColor: { value: new THREE.Color('#FF1493') },
                u_colorSeparation: { value: 0.5 },
                u_colorSharpness: { value: 0.08 },
                u_brightnessFloor: { value: 0.15 },
                u_glowStrength: { value: 2.5 },

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
                u_patternQMult: { value: 4.5 },
                u_patternOffset2: { value: new THREE.Vector2(1.8, 8.5) },
                u_patternFinalMult: { value: 2.0 },
            },
            transparent: false
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