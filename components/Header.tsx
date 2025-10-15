import Link from 'next/link';
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
    return (
        <nav className='absolute w-screen z-1 flex justify-center'>
            {NAV_LINKS.map((link, i) => (
                <React.Fragment key={link.href}>
                    <Link href={link.href}
                        className='link'

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