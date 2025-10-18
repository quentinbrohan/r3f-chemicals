'use client'

import { Canvas, ThreeToJSXElements } from "@react-three/fiber";
import React, { useState } from 'react';

import { PerformanceMonitor, Stats } from "@react-three/drei";
import { extend } from '@react-three/fiber';
import { Leva } from "leva";
import { useSearchParams } from "next/navigation";
import * as THREE from 'three/webgpu';
import { Preload } from "./Preload";

declare module '@react-three/fiber' {
    interface ThreeElements extends ThreeToJSXElements<typeof THREE> { }
}

extend(THREE as any)

interface GlobalSceneProps {
    children: React.ReactElement
    postprocessing?: boolean
}

const GlobalScene: React.FC<GlobalSceneProps> = ({ children, postprocessing = false }) => {
    const [dpr, setDpr] = useState(1.5)

    const alpha = false;

    const params = useSearchParams();

    const showDebug = params.get('debug') === 'true'

    return (
        <>
            <Canvas
                shadows
                camera={{ position: [0, 0, 5], fov: 45 }}
                flat
                gl={{
                    precision: 'highp',
                    powerPreference: 'high-performance',
                    // Disable MSAA when DPR is high to avoid redundant work
                    antialias: !postprocessing && window?.devicePixelRatio < 2,
                    alpha,
                    ...((postprocessing ? {
                        stencil: false, depth: false,
                        toneMapping: THREE.NoToneMapping,  // Disable tone mapping
                        outputColorSpace: THREE.LinearSRGBColorSpace,  // Linear color space
                    } : {})),
                }}
                dpr={dpr}
                style={{
                    position: 'fixed',
                    inset: 0,
                    maxWidth: '100vw',
                    maxHeight: '100vh'
                }}
            >
                {children}
                {showDebug && <Stats />}
                <PerformanceMonitor
                    bounds={(refreshrate) => [59, refreshrate]}
                    onChange={({ factor }) => {

                        // min: 1, max: 2
                        const newDpr = 1.0 + factor * 1.0
                        setDpr(newDpr)
                    }}
                />

                <Preload />
            </Canvas>
            <Leva hidden={!showDebug} />
        </>
    );
}

export default GlobalScene



