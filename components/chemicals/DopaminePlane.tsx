'use client'

import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useMaterials } from "../MonitorsStage/useMaterials";

export const DopaminePlane = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { viewport } = useThree();

    const { dopamineMaterial } = useMaterials({
        enabled: ['DOPAMINE'],
    })

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} material={dopamineMaterial!}>
            <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
        </mesh>
    )
};
