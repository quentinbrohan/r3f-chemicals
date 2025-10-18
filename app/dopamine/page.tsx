'use client'

import { DopaminePlane } from "@/components/chemicals/DopaminePlane"
import { animatePageFadeIn } from "@/lib/animations"
import { useStore } from "@/lib/store"
import { useGSAP } from '@gsap/react'
import { Suspense, useEffect, useRef } from "react"
import gsap from 'gsap'
import dynamic from "next/dynamic"

const GlobalScene = dynamic(() => import('@/components/GlobalScene'), {
    ssr: false,
})

const Dopamine = () => {
    const tlRef = useRef<gsap.core.Timeline | null>(null)
    const isLoaderLoaded = useStore((state) => state.isLoaderLoaded)

    useGSAP(() => {
        if (!isLoaderLoaded) return;

        const tl = gsap.timeline({ id: 'dopamine', paused: true })

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
                <DopaminePlane />
            </GlobalScene>
        </Suspense>
    )
}

export default Dopamine