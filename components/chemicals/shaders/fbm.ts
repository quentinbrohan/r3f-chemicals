export const vertexShader = /* glsl */ `
varying vec2 v_uv;

void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/** dopamine and oxytocin */
export const fragmentShader = /* glsl */ `
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

/** serotonin with full uniforms & full code (like dopamine) but different pattern & color logic */

export const serotoninFragmentShader = /* glsl */ `
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
uniform float u_displacementMult;
uniform float u_glowStrength;
uniform float u_colorSeparation;
uniform float u_colorSharpness;
uniform float u_colorPower;
uniform float u_colorVibration;
uniform float u_turbulence;
uniform float u_directionalWarp;

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

uniform float u_brightnessFloor;

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
    float mouseDist = distance(uv, vec2(mousePos.x * u_uvScale, mousePos.y * u_uvScale));
    float mouseInfluence = smoothstep(u_mouseRadius, 0.0, mouseDist) * u_mouseStrength;

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
