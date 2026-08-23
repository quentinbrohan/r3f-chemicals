import { useTexture } from "@react-three/drei"
import { useControls } from "leva"

export const useCablesTextures = () => {
    return useTexture([
        '/webgl/textures/cables/Rubber004_1K-JPG_Color.webp',
        '/webgl/textures/cables/Rubber004_1K-JPG_NormalGL.webp',
        '/webgl/textures/cables/Rubber004_1K-JPG_Roughness.webp',
        '/webgl/textures/cables/Rubber004_1K-JPG_Displacement.webp',
    ])
}

export function CableMaterial({ label, defaultEnvMapIntensity = 1 }: { label: string; defaultEnvMapIntensity?: number }) {
    const [colorMap, normalMap, roughnessMap, displacementMap] = useCablesTextures()

    const materialProps = useControls(label, {
        color: "#0d0d0d",
        metalness: { value: 0.3, min: 0, max: 1, step: 0.01 },
        roughness: { value: 0.4, min: 0, max: 1, step: 0.01 },
        opacity: { value: 1, min: 0, max: 1, step: 0.01 },
        transparent: false,
        envMapIntensity: { value: defaultEnvMapIntensity, min: 0, max: 5, step: 0.1 },
        emissive: "#0d0d0d",
        emissiveIntensity: { value: 2, min: 0, max: 10 },
        displacementScale: { value: 0.015, min: 0, max: 5 }
    }, { collapsed: true })

    return (
        <meshStandardMaterial
            map={colorMap}
            normalMap={normalMap}
            roughnessMap={roughnessMap}
            displacementMap={displacementMap}
            {...materialProps}
        />
    )
}
