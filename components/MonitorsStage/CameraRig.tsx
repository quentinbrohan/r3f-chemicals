'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { easing } from 'maath'
import gsap from 'gsap'

export const CameraRig = () => {
    const { camera } = useThree()
    const hasAnimatedEntry = useRef(false)

    const targetZ = useRef(camera.position.z)
    const target = new THREE.Vector3(0, 2, 0)

    const minZoom = 3
    // const maxZoom = 7
    const maxZoom = 10

    const horizontalLimit = 2.5  // How far left/right camera can move
    const verticalLimit = 1.5    // How far up it can go from center
    const minY = 1.2             // Prevent camera from dropping below monitor base



    // Initial entry animation
    useEffect(() => {
        if (!hasAnimatedEntry.current) {
            hasAnimatedEntry.current = true

            // Start camera further back
            camera.position.z = maxZoom

            // Animate to default position
            gsap.to(camera.position, {
                z: 5, // position from <Canvas/> in <GlobalScene/>
                duration: 2,
                ease: 'power2.inOut',
                onUpdate: () => {
                    targetZ.current = camera.position.z
                }
            })
        }
    }, [camera])

    // Handle scroll zoom
    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            targetZ.current = THREE.MathUtils.clamp(
                targetZ.current + e.deltaY * 0.01,
                minZoom,
                maxZoom
            )
        }
        window.addEventListener('wheel', onWheel)
        return () => window.removeEventListener('wheel', onWheel)
    }, [])

    useFrame((state, delta) => {
        const pointer = state.pointer

        const factor = 3
        const desiredX = THREE.MathUtils.clamp(pointer.x * factor, -horizontalLimit, horizontalLimit)

        let desiredY = pointer.y * factor
        desiredY = THREE.MathUtils.clamp(desiredY, -verticalLimit, verticalLimit)
        desiredY = Math.max(minY, desiredY)

        const desiredPosition = new THREE.Vector3(
            desiredX,
            desiredY,
            targetZ.current
        )

        // Smooth movement
        easing.damp3(camera.position, desiredPosition.toArray(), 0.3, delta)

        // Apply subtle sine wave to look-at target instead
        const lookAtTarget = new THREE.Vector3(
            0,
            2 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1,
            0
        )
        camera.lookAt(lookAtTarget)
    })

    return null
}
