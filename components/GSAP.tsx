'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'


if (typeof window !== 'undefined') {
    gsap.registerPlugin(useGSAP, ScrambleTextPlugin)
    gsap.defaults({
        ease: 'power2.out',
        duration: 0.5,
    })
}

export function GSAP() {

    return null
}
