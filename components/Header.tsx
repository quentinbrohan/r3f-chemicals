'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useRef } from 'react';
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const NAV_LINKS = [{
    href: "/dopamine",
    label: 'Dopamine'
},
{
    href: "/oxytocin",
    label: 'Oxytocin'
},
{
    href: "/serotonin",
    label: 'Serotonin'
}]

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = ({ }) => {
    const pathname = usePathname();

    const containerRef = useRef<HTMLElement>(null)

    useGSAP(() => {
        const tl = gsap.timeline()

        const container = gsap.utils.selector(containerRef)

        const [mainLinkEl, ...navLinkEls] = container('a')
        const splitEls = container('span')

        tl.add(gsap.fromTo(mainLinkEl, {
            opacity: 0,
            y: 50,
        }, {
            opacity: 1,
            y: 0,
        }), '<+=1.2')
            .add(
                gsap.fromTo([navLinkEls, splitEls], {
                    opacity: 0,
                    y: 32,

                }, {
                    opacity: 1,
                    stagger: 0.1,
                }), '<+=0.25')



    }, {
        scope: containerRef
    })

    return (
        <header ref={containerRef} className='absolute p-4 w-screen z-1 justify-between text-white grid grid-cols-3'>
            <Link data-main-link href="/" className='col-start-2 col-end-3 uppercase font-bold text-2xl text-center opacity-0'>Chemicals</Link>
            <nav className='self-center col-start-3 col-end-4 text-right'>
                {NAV_LINKS.map((link, i) => (
                    <React.Fragment key={link.href}>
                        <Link href={link.href}
                            className={`link ${pathname === link.href ? 'underline' : ''} hover:opacity-60! transition opacity-0`}
                        >
                            {link.label}
                        </Link>
                        {i < NAV_LINKS.length - 1 && <span className='opacity-0'>, </span>}
                    </React.Fragment>

                ))}
            </nav>
        </header>
    );
}

export default Header;