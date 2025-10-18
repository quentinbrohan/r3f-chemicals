'use client'

import { MOTION_CONFIG } from '@/lib/animations'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'


if (typeof window !== 'undefined') {
    gsap.registerPlugin(useGSAP, ScrambleTextPlugin)
    gsap.defaults({
        ease: 'power2.out',
        duration: MOTION_CONFIG.DURATION.DEFAULT,
    })
}

export function GSAP() {

    return null
}
