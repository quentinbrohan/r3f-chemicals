'use client'

import { OxytocinPlane } from "@/components/chemicals/OxytocinPlane"
import { animatePageFadeIn } from "@/lib/animations"
import { useStore } from "@/lib/store"
import { useGSAP } from "@gsap/react"
import gsap from 'gsap'
import dynamic from "next/dynamic"
import { Suspense, useEffect, useRef } from "react"

const GlobalScene = dynamic(() => import('@/components/GlobalScene'), {
    ssr: false,
})

const Oxytocin = () => {
    const tlRef = useRef<gsap.core.Timeline | null>(null)
    const isLoaderLoaded = useStore((state) => state.isLoaderLoaded)

    useGSAP(() => {
        if (!isLoaderLoaded) return;

        const tl = gsap.timeline({ id: 'oxytocin', paused: true })

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
                <OxytocinPlane />
            </GlobalScene>
        </Suspense>
    )
}

export default Oxytocin