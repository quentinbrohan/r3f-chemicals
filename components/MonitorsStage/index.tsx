"use client"

import {
    BakeShadows,
    Environment,
    MeshReflectorMaterial,
    useTexture
} from "@react-three/drei"
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { folder, useControls } from "leva"
import { CableCeilings } from "./CablesCeiling"
import { CablesFloor } from "./CablesFloor"
import { CameraRig } from "./CameraRig"
import { Monitors } from "./Monitors"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect } from "react"

export const MonitorsStage = () => {
    const isMobile = useIsMobile();

    // LIGHTS
    const [ambientLight, setAmbientLight] = useControls("Ambient Light", () => ({
        intensity: { value: 0.7, min: 0, max: 2 },
        color: "#ffffff",
    }), { collapsed: true })

    const [spotMain, setSpotMain] = useControls("Spot Light: Main", () => ({
        position: { value: [2, 4, 0] },
        intensity: { value: 0.8, min: 0, max: 2 },
        angle: { value: 0.6, min: 0, max: Math.PI / 2 },
        penumbra: { value: 0.8, min: 0, max: 1 },
        color: "#e8e8ff",
        castShadow: !isMobile,
    }), { collapsed: true })

    const [spotFill, setSpotFill] = useControls("Spot Light: Fill", () => ({
        position: { value: [-3, 2, -2] },
        intensity: { value: 0.4, min: 0, max: 2 },
        angle: { value: 0.8, min: 0, max: Math.PI / 2 },
        penumbra: { value: 1, min: 0, max: 1 },
        color: "#4a4a6e",
    }), { collapsed: true })

    const [directionalLight, setDirectionalLight] = useControls("Directional Light", () => ({
        position: { value: [0, 10, 0] },
        intensity: { value: 0.6, min: 0, max: 2 },
        color: "#fff5e8",
        castShadow: true,
    }), { collapsed: true })

    const [ceilingLight, setCeilingLight] = useControls("Ceiling Light", () => ({
        position: { value: [0, 4, 0] },
        intensity: { value: 0.8, min: 0, max: 2 },
        distance: { value: 8, min: 0, max: 20 },
        color: '#ffffff',
    }), { collapsed: true })

    // FOG
    const [fog, setFog] = useControls("Fog", () => ({
        enabled: true,
        color: "#000000",
        near: { value: 12, min: 0, max: 50 },
        far: { value: 30, min: 0, max: 100 },
    }), { collapsed: true })

    // GROUND
    const [ground, setGround] = useControls("Ground", () => ({
        blurX: { value: 1024, step: 64, min: 0, max: 1034 },
        blurY: { value: 256, step: 64, min: 0, max: 256 },
        resolution: 1024,
        mixBlur: { value: 4, min: 0, max: 100 },
        mixStrength: { value: 30, min: 0, max: 100 },
        depthScale: { value: 0, min: 0, max: 10 },
        minDepthThreshold: { value: 0.9, min: 0, max: 1 },
        maxDepthThreshold: { value: 1, min: 0, max: 1 },
        color: "#454545",
        metalness: { value: 0.0, min: 0, max: 1 },
        roughness: { value: 0.7, min: 0, max: 10 },
        mirror: { value: 0.85, min: 0, max: 1 },
        displacementScale: { value: 1, min: 0, max: 5 },
        distortion: { value: 0.1, min: 0, max: 1 },
    }), { collapsed: true })

    // ENVIRONMENT
    const environment = useControls("Environment", {
        files: "/webgl/hdri/studio_small_03_1k.hdr",
        environmentIntensity: { value: 0.5, min: 0, max: 2 },
    }, { collapsed: true })

    // OBJECTS: POS + SCALE
    const cablesCeiling = useControls("Cables: Ceiling", {
        position: { value: [0, 4.5, 0.5] },
        scale: { value: 0.6, min: 0.1, max: 2 },
    }, { collapsed: true })

    const cablesFloor = useControls("Cables: Floor", {
        position: { value: [0.25, 0, 0] },
        scale: { value: 0.6, min: 0.1, max: 2 },
    }, { collapsed: true })

    const monitors = useControls("Monitors", {
        position: { value: [0, 2, 0] },
        scale: { value: 1, min: 0.1, max: 2 },
    }, { collapsed: true })

    const [
        normalMap, roughnessMap, colorMap, displacementMap] = useTexture([
            '/webgl/textures/floor/concrete_floor_worn_001_nor_gl_1k.webp',
            '/webgl/textures/floor/concrete_floor_worn_001_rough_1k.webp',
            '/webgl/textures/floor/concrete_floor_worn_001_col_1k.webp',
            '/webgl/textures/floor/concrete_floor_worn_001_disp_1k.webp',
        ])

    const [postProcessing, setPostProcessing] = useControls('Postprocessing', () => ({
        effectComposerEnabled: { value: true, label: 'Enabled' },

        Bloom: folder({
            bloomEnabled: { value: true },
            bloomLuminanceThreshold: { value: 0.9, min: 0, max: 1 },
            bloomLuminanceSmoothing: { value: 0.9, min: 0, max: 1 },
            bloomIntensity: { value: 0.5, min: 0, max: 5 },
            bloomHeight: { value: 300, min: 1, max: 1080, step: 1 },
        }, { collapsed: true }),

        Noise: folder({
            noiseEnabled: { value: true },
            noiseOpacity: { value: 0.015, min: 0, max: 1 },
        }, { collapsed: true }),

        Vignette: folder({
            vignetteEnabled: { value: true },
            vignetteEskil: { value: false },
            vignetteOffset: { value: 0.3, min: 0, max: 1 },
            vignetteDarkness: { value: 0.5, min: 0, max: 1 },
        }, { collapsed: true }),
    }), { collapsed: true })

    useEffect(() => {
        if (isMobile) {
            setAmbientLight({ intensity: 0.35 })
            setSpotMain({ position: [2, 2, 0], intensity: 0.4, angle: 0.5, penumbra: 0.5 })
            setSpotFill({ position: [-2, 1, -2], intensity: 0.18, angle: 0.7, penumbra: 0.8 })
            setDirectionalLight({ position: [0, 6, 10], intensity: 0.25, castShadow: false })
            setCeilingLight({ position: [0, 2, 0], intensity: 0.35, distance: 4 })
            setFog({ near: 15, far: 22 })
            setGround({ blurX: 120, blurY: 40 })
            setPostProcessing({
                bloomHeight: 150,
                bloomIntensity: 0.3,
                bloomLuminanceThreshold: 0.95,
                noiseOpacity: 0.01,
                vignetteOffset: 0.35,
                vignetteDarkness: 0.4,
            })
        }
    }, [isMobile, setAmbientLight, setSpotMain, setSpotFill, setDirectionalLight, setCeilingLight, setFog, setGround, setPostProcessing])

    return (
        <>
            <CameraRig />
            {/* <OrbitControls /> */}

            {/* Lights */}
            <ambientLight {...ambientLight} />
            <spotLight {...spotMain} shadow-mapSize={[1024, 1024]} />
            <spotLight {...spotFill} />
            <directionalLight {...directionalLight} shadow-mapSize={[1024, 1024]} />
            <pointLight {...ceilingLight} />

            {/* Scene Objects */}
            <group>
                <CableCeilings {...cablesCeiling} />
                <Monitors {...monitors} />
                <CablesFloor {...cablesFloor} />
            </group>

            {/* Ground */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[40, 40]} />
                <MeshReflectorMaterial
                    {...{
                        blur: [ground.blurX, ground.blurY],
                        resolution: ground.resolution,
                        mixBlur: ground.mixBlur,
                        mixStrength: ground.mixStrength,
                        depthScale: ground.depthScale,
                        minDepthThreshold: ground.minDepthThreshold,
                        maxDepthThreshold: ground.maxDepthThreshold,
                        color: ground.color,
                        metalness: ground.metalness,
                        roughness: ground.roughness,
                        mirror: ground.mirror,
                        distortion: ground.distortion
                    }}
                    roughnessMap={roughnessMap}
                    normalMap={normalMap}
                    map={colorMap}
                    displacementMap={displacementMap}
                />
            </mesh>

            {/* Fog & Environment */}
            <fog attach="fog" args={[fog.color, fog.near, fog.far]} />
            <Environment
                files={environment.files}
                environmentIntensity={environment.environmentIntensity}
            />

            <BakeShadows />

            {postProcessing.effectComposerEnabled && (
                <EffectComposer>
                    <>
                        {postProcessing.bloomEnabled && (
                            <Bloom
                                luminanceThreshold={postProcessing.bloomLuminanceThreshold}
                                luminanceSmoothing={postProcessing.bloomLuminanceSmoothing}
                                intensity={postProcessing.bloomIntensity}
                                height={postProcessing.bloomHeight}
                            />
                        )}
                        {postProcessing.noiseEnabled && (
                            <Noise opacity={postProcessing.noiseOpacity} />
                        )}
                        {postProcessing.vignetteEnabled && (
                            <Vignette
                                eskil={postProcessing.vignetteEskil}
                                offset={postProcessing.vignetteOffset}
                                darkness={postProcessing.vignetteDarkness}
                            />
                        )}
                    </>
                </EffectComposer>
            )}
        </>
    )
}
