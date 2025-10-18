'use client'

import { SerotoninPlane } from "@/components/chemicals/SerotoninPlane"
import GlobalScene from "@/components/GlobalScene"
import { animatePageFadeIn } from "@/lib/animations"
import { useGSAP } from "@gsap/react"

const Serotonin = () => {
    useGSAP(() => {
        animatePageFadeIn()
    })

    return (
        <GlobalScene>
            <SerotoninPlane />
        </GlobalScene>
    )
}

export default Serotonin