'use client'

import { OxytocinPlane } from "@/components/chemicals/OxytocinPlane"
import GlobalScene from "@/components/GlobalScene"
import { animatePageFadeIn } from "@/lib/animations"
import { useGSAP } from "@gsap/react"

const Oxytocin = () => {
    useGSAP(() => {
        animatePageFadeIn()
    })

    return (
        <GlobalScene>
            <OxytocinPlane />
        </GlobalScene>
    )
}

export default Oxytocin