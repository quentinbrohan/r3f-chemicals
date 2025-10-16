"use client"

import { OrbitControls, PresentationControls } from "@react-three/drei"
import { CableCeilings } from "./CablesCeiling"
import { CablesFloor } from "./CablesFloor"
import { Monitors } from "./Monitors"
import { CameraRig } from "./CameraRig"
import { Suspense } from "react"

export const MonitorsStage = () => {
    return (
        <Suspense>
            <CameraRig />
            <ambientLight intensity={0.5} />
            <spotLight position={[5, 5, 5]} intensity={1.0} castShadow />
            <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow />

            <group>
                <CableCeilings position={[0, 4.5, 0.5]} scale={0.45} />
                <Monitors
                />
                <CablesFloor position={[0, 0, 0]} scale={0.45} />
            </group>
            {/* TODO: water reflection outside of controld */}
        </Suspense>

    )
}