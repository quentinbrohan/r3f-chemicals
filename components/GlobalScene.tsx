'use client'

import { Canvas, ThreeToJSXElements } from "@react-three/fiber";
import React, { useState } from 'react';

import { PerformanceMonitor, Stats } from "@react-three/drei";
import { extend } from '@react-three/fiber';
import { Leva } from "leva";
import { useSearchParams } from "next/navigation";
import * as THREE from 'three/webgpu';
import { Preload } from "./Preload";
import { useIsMobile } from "@/hooks/use-mobile";

declare module '@react-three/fiber' {
    interface ThreeElements extends ThreeToJSXElements<typeof THREE> { }
}

extend(THREE as any)

interface GlobalSceneProps {
    children: React.ReactElement
    postprocessing?: boolean
}

const GlobalScene: React.FC<GlobalSceneProps> = ({ children, postprocessing = false }) => {
    const isMobile = useIsMobile()
    const [dpr, setDpr] = useState(1.5)

    const alpha = false;

    const params = useSearchParams();

    const showDebug = params.has('debug')

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
                    maxHeight: '100vh',
                    pointerEvents: 'all',
                    // Prevent Chrome/Safari swipe-to-navigate triggering on canvas drag
                    touchAction: 'none',
                }}
                eventSource={document.documentElement}
                eventPrefix="client"
            >
                {children}
                {showDebug && <Stats />}
                <PerformanceMonitor
                    bounds={(refreshrate) => [59, refreshrate]}
                    onChange={({ factor }) => {
                        // Desktop: 1.0–2.0 DPR range; mobile: cap at 1.5
                        const maxDpr = isMobile ? 0.5 : 1.0
                        const newDpr = 1.0 + factor * maxDpr
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



