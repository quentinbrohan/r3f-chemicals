'use client'

import { SerotoninPlane } from "@/components/chemicals/SerotoninPlane"
import GlobalScene from "@/components/GlobalScene"
import { animatePageFadeIn } from "@/lib/animations"
import { useStore } from "@/lib/store"
import { useGSAP } from "@gsap/react"
import gsap from 'gsap'
import { useEffect, useRef } from "react"

const Serotonin = () => {
    const tlRef = useRef<gsap.core.Timeline | null>(null)
    const isLoaderLoaded = useStore((state) => state.isLoaderLoaded)

    useGSAP(() => {
        if (!isLoaderLoaded) return;

        const tl = gsap.timeline({ id: 'serotonin', paused: true })

        tl.add(
            animatePageFadeIn()
        )

        tlRef.current = tl
    }, {
        dependencies: [isLoaderLoaded]
    })

    useEffect(() => {
        if (isLoaderLoaded && tlRef.current)
            tlRef.current.play()
    }, [isLoaderLoaded])

    return (
        <GlobalScene>
            <SerotoninPlane />
        </GlobalScene>
    )
}

export default Serotonin