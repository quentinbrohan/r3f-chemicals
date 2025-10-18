'use client'

import { OxytocinPlane } from "@/components/chemicals/OxytocinPlane"
import GlobalScene from "@/components/GlobalScene"
import { animatePageFadeIn } from "@/lib/animations"
import { useStore } from "@/lib/store"
import { useGSAP } from "@gsap/react"
import gsap from 'gsap'
import { useEffect, useRef } from "react"

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
        <GlobalScene>
            <OxytocinPlane />
        </GlobalScene>
    )
}

export default Oxytocin