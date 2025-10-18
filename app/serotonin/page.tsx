'use client'

import { SerotoninPlane } from "@/components/chemicals/SerotoninPlane"
import { animatePageFadeIn } from "@/lib/animations"
import { useStore } from "@/lib/store"
import { useGSAP } from "@gsap/react"
import gsap from 'gsap'
import dynamic from "next/dynamic"
import { Suspense, useEffect, useRef } from "react"

const GlobalScene = dynamic(() => import('@/components/GlobalScene'), {
    ssr: false,
})

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
        <Suspense>
            <GlobalScene>
                <SerotoninPlane />
            </GlobalScene>
        </Suspense>
    )
}

export default Serotonin