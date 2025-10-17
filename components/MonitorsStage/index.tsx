"use client"

import {
    BakeShadows,
    Environment,
    MeshReflectorMaterial,
    Preload,
} from "@react-three/drei"
import { Suspense } from "react"
import { useControls } from "leva"
import { CableCeilings } from "./CablesCeiling"
import { CablesFloor } from "./CablesFloor"
import { CameraRig } from "./CameraRig"
import { Monitors } from "./Monitors"

export const MonitorsStage = () => {
    // LIGHTS
    const ambientLight = useControls("Scene/Lights/Ambient", {
        intensity: { value: 0.3, min: 0, max: 2 },
        color: "#ffffff",
    })

    const spotMain = useControls("Scene/Lights/Spot Main", {
        position: { value: [2, 4, 0] },
        intensity: { value: 0.8, min: 0, max: 2 },
        angle: { value: 0.6, min: 0, max: Math.PI / 2 },
        penumbra: { value: 0.8, min: 0, max: 1 },
        color: "#e8e8ff",
        castShadow: true,
    })

    const spotFill = useControls("Scene/Lights/Spot Fill", {
        position: { value: [-3, 2, -2] },
        intensity: { value: 0.4, min: 0, max: 2 },
        angle: { value: 0.8, min: 0, max: Math.PI / 2 },
        penumbra: { value: 1, min: 0, max: 1 },
        color: "#4a4a6e",
    })

    const directionalLight = useControls("Scene/Lights/Directional", {
        position: { value: [0, 10, 0] },
        intensity: { value: 0.6, min: 0, max: 2 },
        color: "#fff5e8",
        castShadow: true,
    })

    // FOG
    const fog = useControls("Scene/Fog", {
        color: "#000000",
        near: { value: 8, min: 0, max: 50 },
        far: { value: 25, min: 0, max: 100 },
    })

    // GROUND
    const ground = useControls("Scene/Ground", {
        blurX: { value: 80, min: 0, max: 200 },
        blurY: { value: 40, min: 0, max: 200 },
        resolution: 1024,
        mixBlur: { value: 0.6, min: 0, max: 1 },
        mixStrength: { value: 40, min: 0, max: 100 },
        depthScale: { value: 4, min: 0, max: 10 },
        minDepthThreshold: { value: 0.6, min: 0, max: 1 },
        maxDepthThreshold: { value: 1.0, min: 0, max: 1 },
        color: "#0a0a0a",
        metalness: { value: 0.4, min: 0, max: 1 },
        roughness: { value: 0.3, min: 0, max: 1 },
        mirror: { value: 0.5, min: 0, max: 1 },
    })

    // ENVIRONMENT
    const environment = useControls("Scene/Environment", {
        files: "/webgl/hdri/studio_small_03_1k.hdr",
        environmentIntensity: { value: 0.25, min: 0, max: 2 },
    })

    // OBJECTS: POS + SCALE
    const cablesCeiling = useControls("Scene/Objects/CablesCeiling", {
        position: { value: [0, 4.5, 0.5] },
        scale: { value: 0.45, min: 0.1, max: 2 },
    })

    const cablesFloor = useControls("Scene/Objects/CablesFloor", {
        position: { value: [0, 0, 0] },
        scale: { value: 0.45, min: 0.1, max: 2 },
    })

    const monitors = useControls("Scene/Objects/Monitors", {
        position: { value: [0, 2, 0] },
        scale: { value: 1, min: 0.1, max: 2 },
    })

    return (
        <Suspense>
            <CameraRig />

            {/* Lights */}
            <ambientLight {...ambientLight} />
            <spotLight {...spotMain} shadow-mapSize={[1024, 1024]} />
            <spotLight {...spotFill} />
            <directionalLight {...directionalLight} shadow-mapSize={[1024, 1024]} />

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
                    }}
                />
            </mesh>

            {/* Fog & Environment */}
            <fog attach="fog" args={[fog.color, fog.near, fog.far]} />
            <Environment
                files={environment.files}
                environmentIntensity={environment.environmentIntensity}
            />

            <Preload />
            <BakeShadows />
        </Suspense>
    )
}
