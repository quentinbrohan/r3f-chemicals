"use client"

import { PresentationControls } from "@react-three/drei"
import { CableCeilings } from "./CablesCeiling"
import { CablesFloor } from "./CablesFloor"
import { Monitors } from "./Monitors"

export const MonitorsStage = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <spotLight position={[5, 5, 5]} intensity={1.0} castShadow />
            <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow />
            <PresentationControls
                global
                polar={[0, 0]}
                azimuth={[-Math.PI / 2, Math.PI / 2]}
                config={{ mass: 1, tension: 170 }}
            >
                <group>
                    <CableCeilings position={[0, 4.5, 0.5]} scale={0.45} />
                    <Monitors
                    />
                    <CablesFloor position={[0, 0, 0]} scale={0.45} />
                </group>
            </PresentationControls>
            {/* TODO: water reflection outside of controld */}

            {/* <OrbitControls /> */}
        </>

    )
}