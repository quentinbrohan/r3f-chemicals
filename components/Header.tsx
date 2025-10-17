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
        <header className='absolute p-4 w-screen z-1 justify-between text-white grid grid-cols-3'>
            <Link href="/" className='col-start-2 col-end-3 uppercase font-bold text-2xl text-center'>Chemicals</Link>
            <nav className='self-center col-start-3 col-end-4 text-right'>
                {NAV_LINKS.map((link, i) => (
                    <React.Fragment key={link.href}>
                        <Link href={link.href}
                            className={`link ${pathname === link.href ? 'underline' : ''} hover:opacity-60 transition`}
                        >
                            {link.label}
                        </Link>
                        {i < NAV_LINKS.length - 1 && <span>, </span>}
                    </React.Fragment>

                ))}
            </nav>
        </header>
    );
}

export default Header;