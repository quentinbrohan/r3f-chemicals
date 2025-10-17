import React, { useState } from 'react'

// TODO: GSAP + scrambleText

interface DOMProps { }

const DOM: React.FC<DOMProps> = () => {
    const [showAbout, setShowAbout] = useState(false)

    return (
        <main className="relative h-screen w-full pointer-events-none z-1">
            {/* TODO: display somewhere on side of screen */}
            <div className="absolute right-4 bottom-4 text-white/60 uppercase text-xs flex flex-col gap-1">
                <p >Click on a monitor to view fullscreen</p>
                <p >Scroll to get closer</p>
                <p >Move your mouse to rotate</p>
            </div>

            {/* About button - bottom left */}
            <button
                onClick={() => setShowAbout(!showAbout)}
                className="absolute left-4 bottom-4 pointer-events-auto text-white cursor-pointer text-xs uppercase"
            >
                {showAbout ? '[ Close ]' : '[ About ]'}
            </button>

            {/* About description panel - anchored to button position with +2rem offset */}
            {showAbout && (
                <div className="absolute left-4 bottom-[calc(1rem+2rem)] pointer-events-auto text-white max-w-md flex flex-col gap-2">
                    <p className="text-xs">
                        Visualizing hormones with procedural shaders: dopamine, oxytocin, serotonin. R3F.
                    </p>
                    <p className="text-xs">
                        Each monitor displays a unique shader pattern representing the chemical identity
                        and emotional associations of key neurotransmitters.
                    </p>
                </div>
            )}
        </main>
    )
}

export default DOM