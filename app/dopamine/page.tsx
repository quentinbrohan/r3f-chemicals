'use client'

import { DopaminePlane } from "@/components/chemicals/DopaminePlane"
import GlobalScene from "@/components/GlobalScene"
import { animatePageFadeIn } from "@/lib/animations"
import { useGSAP } from '@gsap/react'

const Dopamine = () => {
    useGSAP(() => {
        animatePageFadeIn()
    })

    return (
        <GlobalScene>
            <DopaminePlane />
        </GlobalScene>
    )
}

export default Dopamine