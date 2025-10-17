'use client'

import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const DOM: React.FC = () => {
    const [showAbout, setShowAbout] = useState(false)
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
        }), '<+=1.2')
            .add(

                gsap.to(helperEls, {
                    scrambleText: {
                        text: '{original}',
                        chars: 'DAOTSHCN5-',
                        revealDelay: 0.5,
                    },
                    stagger: 0.2,
                    repeat: -1,
                    repeatDelay: 5,
                }), '<')
            .add(gsap.from(aboutButtonRef.current, {
                opacity: 0,
                y: 32,
                duration: 0.3,
            }), '<+=0.6')

    }, { scope: containerRef })

    useEffect(() => {
        if (!aboutPanelRef.current) return

        if (!aboutTlRef.current) {
            const tl = gsap.timeline({ paused: true })

            tl.fromTo(
                aboutPanelRef.current,
                { opacity: 0, y: 32, visibility: 'visible' },
                {
                    opacity: 1, y: 0, duration: 0.5,
                }
            )

            aboutTlRef.current = tl
        }

        if (showAbout) {
            aboutTlRef.current.play()
        } else {
            aboutTlRef.current.reverse()
        }
    }, [showAbout])
    return (
        <main ref={containerRef} className="relative h-screen w-full pointer-events-none z-1">
            <div className='invisible md:visible' >
                <p data-helper className="absolute left-4 top-1/2 text-white/70 uppercase text-xs">
                    [ Click on a monitor to view fullscreen ]
                </p>
                <p data-helper className="absolute right-4 bottom-8 text-white/70 uppercase text-xs">
                    [ Scroll to get closer ]
                </p>
                <p data-helper className="absolute right-4 bottom-4 text-white/70 uppercase text-xs">
                    [ Move your mouse to rotate ]
                </p>
            </div>

            <button
                ref={aboutButtonRef}
                onClick={() => setShowAbout(!showAbout)}
                className="absolute left-4 bottom-4 pointer-events-auto text-white hover:opacity-60! transition cursor-pointer text-xs uppercase z-1"
            >
                {showAbout ? '( Close )' : '( About )'}
            </button>

            <div
                ref={aboutPanelRef}
                className="absolute left-4 bottom-[calc(1rem+2rem)] pointer-events-auto text-white max-w-md flex flex-col gap-2 invisible"
            >
                <p className="text-xs">
                    Visualizing hormones with procedural shaders: dopamine, oxytocin, serotonin. R3F.
                </p>
                <p className="text-xs">
                    Each monitor displays a unique shader pattern representing the chemical identity
                    and emotional associations of key neurotransmitters.
                </p>
            </div>
        </main>
    )
}

export default DOM