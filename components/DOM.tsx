'use client'

import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { HormoneNames, useStore } from '@/lib/store'
import { animatePageFadeIn, MOTION_CONFIG } from '@/lib/animations'
import Link from 'next/link'
import { useIsMobile } from '@/hooks/use-mobile'

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
    const isLoaderLoaded = useStore((state) => state.isLoaderLoaded)
    const mainTlRef = useRef<gsap.core.Timeline | null>(null)

    useGSAP(() => {
        if (!isLoaderLoaded) return;
        const tl = gsap.timeline({ id: 'dom', paused: true })

        const container = gsap.utils.selector(containerRef)

        const helperEls = container('[data-helper]')

        tl.add(
            animatePageFadeIn(),
            '<+=0.6')
            .add(gsap.from(helperEls, {
                opacity: 0,
                y: MOTION_CONFIG.Y_OFFSET.MD,
                duration: MOTION_CONFIG.DURATION.TRANSITION,
                stagger: MOTION_CONFIG.STAGGER.LG,
            }))
            .add(

                gsap.to(helperEls, {
                    opacity: 1,
                    scrambleText: {
                        text: '{original}',
                        chars: MOTION_CONFIG.SCRAMBLE.CHARSET,
                        revealDelay: 0.4,
                    },
                    stagger: MOTION_CONFIG.STAGGER.LG,
                    repeat: -1,
                    repeatDelay: 5,
                    duration: MOTION_CONFIG.DURATION.SCRAMBLE
                }), '<')
            .add(gsap.fromTo(aboutButtonRef.current,
                { autoAlpha: 0, y: MOTION_CONFIG.Y_OFFSET.MD },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: MOTION_CONFIG.DURATION.CTA,
                }
            ), '<+=0.6')

        mainTlRef.current = tl;

    }, { scope: containerRef, dependencies: [isLoaderLoaded] })


    useEffect(() => {
        if (isLoaderLoaded && mainTlRef.current)
            mainTlRef.current.play()
    }, [isLoaderLoaded])



    useEffect(() => {
        if (!aboutPanelRef.current) return

        if (!aboutTlRef.current) {
            const tl = gsap.timeline({ paused: true })

            const container = gsap.utils.selector(aboutPanelRef)
            const paragraphs = container('p')


            tl.fromTo(
                aboutPanelRef.current,
                { opacity: 0, visibility: 'hidden' },
                {
                    opacity: 1,
                    autoAlpha: 1,
                    visibility: 'visible',
                    duration: 0.001,
                }
            )
            tl.fromTo(
                paragraphs,
                { opacity: 0, y: MOTION_CONFIG.Y_OFFSET.MD, visibility: 'hidden' },
                {
                    opacity: 1, y: 0,
                    autoAlpha: 1,
                    visibility: 'visible',
                    stagger: MOTION_CONFIG.STAGGER.MD
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
                { opacity: 0, y: MOTION_CONFIG.Y_OFFSET.MD },
                {
                    opacity: 1,
                    y: 0,
                    duration: MOTION_CONFIG.DURATION.CTA, // same as in <HormoneLabel />
                    stagger: MOTION_CONFIG.STAGGER.MD
                }
            )
        }
    }, [hoveredName])

    const isMobile = useIsMobile();

    return (
        <main ref={containerRef} className="relative h-[100svh] w-full z-1">
            <div className='md:visible pointer-events-none' >
                <p data-helper className="absolute  left-2 top-1/6 md:left-4 md:top-1/5 text-white/70 uppercase text-xs opacity-0">
                    [ {isMobile ? 'Double-tap' : `Double-click`} on a monitor to view fullscreen ]
                </p>
                <p data-helper className="invisible md:visible absolute right-4 bottom-1/3 text-white/70 uppercase text-xs opacity-0">
                    [ Scroll to get closer ]
                </p>
                <p data-helper className="invisible md:visible absolute right-4 bottom-1/6 text-white/70 uppercase text-xs opacity-0">
                    [ Move your mouse to rotate ]
                </p>
            </div>

            <button
                ref={aboutButtonRef}
                onClick={() => setShowAboutPanel(!showAboutPanel)}
                className="absolute left-2 md:left-4 bottom-2 md:bottom-4 pointer-events-auto text-white hover:opacity-60! transition cursor-pointer text-xs uppercase z-1 opacity-0"
            >
                {showAboutPanel ? '( Close )' : '( About )'}
            </button>

            <div
                ref={aboutPanelRef}
                className="absolute left-2 md:left-4 right-2 md:right-4 bottom-[calc(1rem+1.5rem)] md:bottom-[calc(1rem+2rem)] pointer-events-auto text-white max-w-md flex flex-col gap-1"
            >
                <p className="text-xs opacity-0">
                    Real-time visualization of hormones with procedural shaders using WebGL and React Three Fiber.
                </p>
                <p className="text-xs opacity-0">
                    Each monitor displays a unique shader pattern representing the chemical identity
                    and emotional associations of key neurotransmitters.
                </p>
                <p className="text-xs opacity-0">
                    For more information or to explore other projects, visit <a className='link hover:underline transition' href="https://quentinbrohan.fr/" target="_blank" rel="noopener noreferrer">quentinbrohan.fr</a>.
                </p>
                <p className="text-xs opacity-0">
                    CREDITS// 3D Models: <a className='link hover:underline transition' href="http://monogrid.com/" target="_blank" rel="noopener noreferrer">MONOGRID</a>.
                </p>
            </div>

            <div
                ref={descriptionRef}
                className="absolute  left-2 md:left-auto right-2 md:right-4 bottom-2/6 md:bottom-4 text-sm text-white max-w-sm flex flex-col gap-1 pointer-events-none"
            >
                {
                    hoveredName && (
                        <>
                            <p className="text-xs">{HORMONES_DESCRIPTIONS[hoveredName].description}</p>
                            <p className="text-xs italic">{HORMONES_DESCRIPTIONS[hoveredName].shaderDescription}</p>
                        </>

                    )
                }
            </div>
        </main>
    )
}

export default DOM