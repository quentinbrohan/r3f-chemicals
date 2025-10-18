'use client'

import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { HormoneNames, useStore } from '@/lib/store'

const HORMONES_DESCRIPTIONS: Record<HormoneNames, {
    description: string;
    shaderDescription: string;
}> = {
    'DOPAMINE': {
        description: `Known as the "reward" chemical, dopamine drives motivation, pleasure, and the anticipation of rewards.`,
        shaderDescription: `Molten energy pulses through in sudden, electric bursts.`
    },
    'OXYTOCIN': {
        description: `Called the "love hormone," oxytocin fosters trust, bonding, and emotional connection in relationships.`,
        shaderDescription: `Warm spirals flow like a heartbeat shared between souls.`
    },
    'SEROTONIN': {
        description: `Often called the "feel-good" hormone, serotonin helps regulate mood, sleep, and emotional well-being.`,
        shaderDescription: `Drifts in soft waves — a calm, introspective rhythm.`
    }
}

const DOM: React.FC = () => {
    const [showAboutPanel, setShowAboutPanel] = useState(false)

    const containerRef = useRef<HTMLElement>(null)
    const aboutButtonRef = useRef<HTMLButtonElement>(null)
    const aboutPanelRef = useRef<HTMLDivElement>(null)

    const aboutTlRef = useRef<gsap.core.Timeline | null>(null)


    useGSAP(() => {
        const tl = gsap.timeline()

        const container = gsap.utils.selector(containerRef)

        const helperEls = container('[data-helper]')

        tl.add(gsap.from(helperEls, {
            opacity: 0,
            y: 32,
            duration: 0.8,
            stagger: 0.2,
        }), '<+=0.6')
            .add(

                gsap.to(helperEls, {
                    scrambleText: {
                        text: '{original}',
                        chars: 'DAOTSHCN5-',
                        revealDelay: 0.4,
                    },
                    stagger: 0.2,
                    repeat: -1,
                    repeatDelay: 5,
                    duration: 1
                }), '<')
            .add(gsap.fromTo(aboutButtonRef.current,
                { autoAlpha: 0, y: 32 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.3,
                }
            ), '<+=0.6')

    }, { scope: containerRef })

    useEffect(() => {
        if (!aboutPanelRef.current) return

        if (!aboutTlRef.current) {
            const tl = gsap.timeline({ paused: true })

            tl.fromTo(
                aboutPanelRef.current,
                { opacity: 0, y: 32, visibility: 'hidden' },
                {
                    opacity: 1, y: 0, duration: 0.5,
                    autoAlpha: 1,
                    visibility: 'visible'
                }
            )

            aboutTlRef.current = tl
        }

        if (showAboutPanel) {
            aboutTlRef.current.play()
        } else {
            aboutTlRef.current.reverse()
        }
    }, [showAboutPanel])

    const hoveredName = useStore((state) => state.hoveredName)
    const descriptionRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        if (hoveredName && descriptionRef.current) {
            const container = gsap.utils.selector(descriptionRef)
            const paragraphs = container('p')

            gsap.fromTo(
                paragraphs,
                { opacity: 0, y: 32 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.3, // same as in <HormoneLabel />
                    stagger: 0.1
                }
            )
        }
    }, [hoveredName])

    return (
        <main ref={containerRef} className="relative h-screen w-full z-1 pointer-events-none">
            <div className='invisible md:visible pointer-events-none' >
                <p data-helper className="absolute left-4 top-1/3 text-white/70 uppercase text-xs">
                    [ Click on a monitor to view fullscreen ]
                </p>
                <p data-helper className="absolute right-4 bottom-1/3 text-white/70 uppercase text-xs">
                    [ Scroll to get closer ]
                </p>
                <p data-helper className="absolute right-4 bottom-1/6 text-white/70 uppercase text-xs">
                    [ Move your mouse to rotate ]
                </p>
            </div>

            <button
                ref={aboutButtonRef}
                onClick={() => setShowAboutPanel(!showAboutPanel)}
                className="absolute left-4 bottom-4 pointer-events-auto text-white hover:opacity-60! transition cursor-pointer text-xs uppercase z-1"
            >
                {showAboutPanel ? '( Close )' : '( About )'}
            </button>

            <div
                ref={aboutPanelRef}
                className="absolute left-4 bottom-[calc(1rem+2rem)] pointer-events-auto text-white max-w-md flex flex-col gap-1"
            >
                <p className="text-xs">
                    Visualizing hormones with procedural shaders: dopamine, oxytocin, serotonin. R3F.
                </p>
                <p className="text-xs italic">
                    Each monitor displays a unique shader pattern representing the chemical identity
                    and emotional associations of key neurotransmitters.
                </p>
            </div>

            <div
                ref={descriptionRef}
                className="absolute right-4 bottom-4 text-sm text-white max-w-md flex flex-col gap-1"
            >
                {
                    hoveredName && (
                        <>
                            <p className="text-xs">{HORMONES_DESCRIPTIONS[hoveredName].description}</p>
                            <p className="text-xs">{HORMONES_DESCRIPTIONS[hoveredName].shaderDescription}</p>
                        </>

                    )
                }
            </div>
        </main>
    )
}

export default DOM