'use client'

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useControls, folder } from 'leva';

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

varying vec2 v_uv;

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(1.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
        mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
        mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x),
        u.y);
    return res*res;
}

const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);

float fbm(in vec2 p) {
    float f = 0.0;
    f += 0.5000*noise(p); p = m2*p*2.02;
    f += 0.2500*noise(p); p = m2*p*2.03;
    f += 0.1250*noise(p); p = m2*p*2.01;
    f += 0.0625*noise(p);
    return f/0.769;
}

float pattern(in vec2 p, float mouseInfluence) {
    vec2 q = vec2(fbm(p + vec2(0.0,0.0)));
    vec2 r = vec2(fbm(p + 4.0*q + vec2(1.7,9.2) + mouseInfluence));
    r += u_time * u_timeSpeed;
    return fbm(p + 1.760*r);
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
    const { size, mouse, clock, viewport } = useThree();

    const controls = useControls('FBM Shader', {
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
            mouseRadius: { value: 0.5, min: 0, max: 1, step: 0.01 },
            mouseStrength: { value: 0.3, min: 0, max: 1, step: 0.01 },
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

                // Colors
                u_color1: { value: new THREE.Color('#0066ff') },
                u_color1Intensity: { value: 1.0 },
                u_color2: { value: new THREE.Color('#ff6600') },
                u_color2Intensity: { value: 1.0 },
                u_colorSeparation: { value: 0.5 },
                u_colorSharpness: { value: 0.1 },

                // Mouse
                u_mouseRadius: { value: 0.5 },
                u_mouseStrength: { value: 0.3 },
                u_enableMouse: { value: true },
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

        // Colors
        material.uniforms.u_color1.value.set(controls.color1);
        material.uniforms.u_color1Intensity.value = controls.color1Intensity;
        material.uniforms.u_color2.value.set(controls.color2);
        material.uniforms.u_color2Intensity.value = controls.color2Intensity;
        material.uniforms.u_colorSeparation.value = controls.colorSeparation;
        material.uniforms.u_colorSharpness.value = controls.colorSharpness;

        // Mouse
        material.uniforms.u_mouseRadius.value = controls.mouseRadius;
        material.uniforms.u_mouseStrength.value = controls.enableMouse ? controls.mouseStrength : 0;
        material.uniforms.u_enableMouse.value = controls.enableMouse;
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} material={material}>
            <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
        </mesh>
    );
};