"use client"

import GlobalScene from "@/components/GlobalScene"
import { CableCeilings } from "@/components/Stage/(components)/CablesCeiling"
import { CablesFloor } from "@/components/Stage/(components)/CablesFloor"
import { Monitors } from "@/components/Stage/(components)/Monitors"
import { OrbitControls, PresentationControls } from "@react-three/drei"
import { useMemo } from "react"
import * as THREE from 'three'

export default function Home() {

  const monitors = useMemo(() => [
    {
      position: [-2, 0, -1],
      material: new THREE.MeshBasicMaterial({ color: '#ff5050' }), // Dopamine
    },
    {
      position: [0, 0, 0],
      material: new THREE.MeshBasicMaterial({ color: '#50ff50' }), // Oxytocin
    },
    {
      position: [2, 0, -1],
      material: new THREE.MeshBasicMaterial({ color: '#5050ff' })  // Serotonin
    }], [])

  return (
    <>
      {/* <DOM /> */}
      <GlobalScene>
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
              {monitors && <Monitors

                // position={[0, 0, 0]}
                monitors={monitors}
                position={[0, 2, 0]}
              />}
              <CablesFloor position={[0, 0, 0]} scale={0.45} />
            </group>
          </PresentationControls>
          {/* TODO: water reflection outside of controld */}

          <OrbitControls />
        </>
      </GlobalScene>
    </>
  )
}
