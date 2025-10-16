"use client"

import { MeshReflectorMaterial, OrbitControls, PresentationControls, Environment } from "@react-three/drei"
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
            <ambientLight intensity={0.7} />
            <spotLight position={[2, 4, 0]} intensity={1.5} castShadow />
            <directionalLight position={[0, 10, 0]} intensity={1.5} castShadow />
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
                    blur={[300, 100]}
                    resolution={2048}
                    mixBlur={1}
                    mixStrength={80}
                    depthScale={8}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#1a1a1a"
                    metalness={0.6}
                    roughness={0.1}
                />
            </mesh>
        </Suspense>

    )
}