'use client'

import { Canvas, CanvasProps, ThreeToJSXElements } from "@react-three/fiber";
import React, { useState } from 'react';

import { Stats } from "@react-three/drei";
import { extend } from '@react-three/fiber';
import * as THREE from 'three/webgpu';
import { usePathname, useSearchParams, } from "next/navigation";
import { Leva } from "leva";

declare module '@react-three/fiber' {
    interface ThreeElements extends ThreeToJSXElements<typeof THREE> { }
}

extend(THREE as any)

interface GlobalSceneProps {
    children: React.ReactElement
}

const GlobalScene: React.FC<GlobalSceneProps> = ({ children }) => {
    const [frameloop, setFrameloop] = useState<CanvasProps['frameloop']>("never");

    // TODO: keep only for webgpu later or in prod only. Complex shaders takes almost a minute to compile
    // const glCallback = useCallback(async (props: GLProps) => {
    //     console.log('WebGL: Initing...')
    //     console.time('WebGL: Init took:')

    //     const renderer = new WebGPURenderer({
    //         ...props as any,
    //         powerPreference: "high-performance",
    //         antialias: true,
    //         alpha: false,
    //         stencil: false,
    //     });

    //     renderer.outputColorSpace = THREE.SRGBColorSpace;
    //     renderer.toneMapping = THREE.NoToneMapping;
    //     renderer.toneMappingExposure = 0.5;

    //     renderer.init().then(() => {
    //         console.timeEnd('WebGL: Init took:')
    //         setFrameloop("always");
    //     });

    //     return renderer;
    // }, []); // Empty deps - only create once

    const postprocessing = false;
    const alpha = false;

    const params = useSearchParams();

    const showDebug = params.get('debug') === 'true'

    return (
        <>
            <Canvas
                shadows
                camera={{ position: [0, 0, 5], fov: 45 }}
                // frameloop={frameloop}
                // gl={glCallback}
                gl={{
                    precision: 'highp',
                    powerPreference: 'high-performance',
                    // Disable MSAA when DPR is high to avoid redundant work
                    // antialias: !postprocessing && window?.devicePixelRatio < 2,
                    alpha,
                    ...((postprocessing ? { stencil: false, depth: false } : {})),
                }}
                dpr={[1, 2]}
                style={{
                    position: 'fixed',
                    inset: 0,
                    maxWidth: '100vw',
                    maxHeight: '100vh'
                }}
            >
                {children}
                {/* <DopaminePlane /> */}
                {/* <OxytocinPlane /> */}
                {/* <SerotoninPlane /> */}
                {showDebug && <Stats />}
                {/* <Preload /> */}
            </Canvas>
            <Leva hidden={!showDebug} />
        </>
    );
}

export default GlobalScene



