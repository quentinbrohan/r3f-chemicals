import { useTexture } from "@react-three/drei"

export const useCablesTextures = () => {
    return useTexture([
        '/webgl/textures/cables/Rubber004_1K-JPG_Color.jpg',
        '/webgl/textures/cables/Rubber004_1K-JPG_NormalGL.jpg',
        '/webgl/textures/cables/Rubber004_1K-JPG_Roughness.jpg',
        '/webgl/textures/cables/Rubber004_1K-JPG_Displacement.jpg',
    ])
}