'use client'

import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useMaterials } from "../MonitorsStage/useMaterials";

export const OxytocinPlane = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { viewport } = useThree();

    const { oxytocinMaterial } = useMaterials({
        enabled: ['OXYTOCIN'],
    })

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} material={oxytocinMaterial!}>
            <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
        </mesh>
    )
};