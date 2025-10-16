'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

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

    return (
        <nav className='absolute w-screen z-1 flex justify-center text-white'>
            {NAV_LINKS.map((link, i) => (
                <React.Fragment key={link.href}>
                    <Link href={link.href}
                        className={`link ${pathname === link.href ? 'underline' : ''} hover:opacity-60 transition`}
                    >
                        {link.label}
                    </Link>
                    {i < NAV_LINKS.length - 1 && <span>,</span>}
                </React.Fragment>

            ))}
        </nav>
    );
}

export default Header;