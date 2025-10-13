import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { uv, vec3, vec4, uniform } from "three/tsl";
import { NodeMaterial } from "three/webgpu";

export const FBMShaderPlane = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size, mouse, clock, viewport, gl } = useThree();

    const [material] = useState(() => {
        console.log('Simple Material: Initing...')
        console.time('Simple Material: Init took:')
        const mat = new NodeMaterial();

        // Just a simple color gradient based on UV
        const uvNode = uv();
        const color = vec3(uvNode.x, uvNode.y, 0.5);

        mat.colorNode = vec4(color, 1.0);
        mat.transparent = false;

        console.timeEnd('Simple Material: Init took:')
        return mat;
    });

    // Precompile
    // useEffect(() => {
    //     if (!material || !gl) return;

    //     console.log('Simple Material: Precompiling shader...')
    //     console.time('Simple Material: Precompile took:')

    //     const tempScene = new THREE.Scene();
    //     const tempMesh = new THREE.Mesh(new THREE.PlaneGeometry(), material);
    //     tempScene.add(tempMesh);

    //     gl.compileAsync(tempScene, new THREE.Camera()).then(() => {
    //         console.timeEnd('Simple Material: Precompile took:')
    //         tempScene.remove(tempMesh);
    //     });
    // }, [material, gl]);

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
};