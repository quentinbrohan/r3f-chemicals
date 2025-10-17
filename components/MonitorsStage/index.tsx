"use client"

import { MeshReflectorMaterial, OrbitControls, PresentationControls, Environment, Preload } from "@react-three/drei"
import { CableCeilings } from "./CablesCeiling"
import { CablesFloor } from "./CablesFloor"
import { Monitors } from "./Monitors"
import { CameraRig } from "./CameraRig"
import { Suspense } from "react"

export const MonitorsStage = () => {
    // todo: leva controls for scene

    return (
        <Suspense>
            <CameraRig />
            <ambientLight intensity={0.3} />
            <spotLight
                position={[2, 4, 0]}
                intensity={0.8}
                angle={0.6}
                penumbra={0.8}
                castShadow
                shadow-mapSize={[1024, 1024]}
                color="#e8e8ff"
            />
            <directionalLight
                position={[0, 10, 0]}
                intensity={0.6}
                castShadow
                shadow-mapSize={[1024, 1024]}
                color="#fff5e8"
            />

            <spotLight
                position={[-3, 2, -2]}
                intensity={0.4}
                angle={0.8}
                penumbra={1}
                color="#4a4a6e"
            />
            <group>
                <CableCeilings position={[0, 4.5, 0.5]} scale={0.45} />
                <Monitors />
                <CablesFloor position={[0, 0, 0]} scale={0.45} />
            </group>
            <mesh
                position={[0, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]} // face up
            >
                <planeGeometry args={[40, 40]} />
                <MeshReflectorMaterial
                    blur={[80, 40]}
                    resolution={1024}
                    mixBlur={0.6}
                    mixStrength={40}
                    depthScale={4}
                    minDepthThreshold={0.6}
                    maxDepthThreshold={1.0}
                    color="#0a0a0a"
                    metalness={0.4}
                    roughness={0.3}
                    mirror={0.5}
                />
            </mesh>
            <fog attach="fog" args={['#000000', 8, 25]} />
            <Environment
                files="/webgl/hdri/studio_small_03_1k.hdr"
                environmentIntensity={0.1} />
            <Preload />
        </Suspense>

    )
}