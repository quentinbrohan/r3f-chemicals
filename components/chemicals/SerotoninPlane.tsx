'use client'

import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useMaterials } from "../MonitorsStage/useMaterials";

export const SerotoninPlane = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { viewport } = useThree();

    const { serotoninMaterial } = useMaterials({
        enabled: ['SEROTONIN'],
    })

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} material={serotoninMaterial!}>
            <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
        </mesh>
    )
};