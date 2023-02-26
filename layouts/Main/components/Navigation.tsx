import React, { useCallback } from 'react'
import { Link } from 'components/shared/Link'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import Logo from './Logo'
import SocialLinks from './SocialLinks'
import { useMobileMenuToggle } from 'providers/MobileMenuToggleProvider'
import { useRouter } from 'next/router'
import { useWeb3Connection } from 'providers/Web3ConnectionProvider'

const NAVIGATION_ITEMS: [string, string, boolean?][] = [
    ['Dashboard', '/'],
    ['My Collection', '/my-collection'],
    ['Greenroom', '/greenroom'],
    ['NFT Impact Program', '/nip'],
    ['FAQs', '/faqs'],
    ['Merch', '/merch'],
    ['Community', '/community'],
]

export default function () {
    const router = useRouter()

    const { toggle } = useMobileMenuToggle()
    
    const { disconnect, connected, connect } = useWeb3Connection()
    
    const handleLogoutClick = useCallback(() => {
        connected ? disconnect() : connect(),
        toggle()
    }, [toggle, connected])

    const handleSocialLinksClick = useCallback(
        (e) => {
            e.target.tagName.toLowerCase() === 'img' && toggle()
        },
        [toggle]
    )
    return (
        <div className="relative h-full bg-dull-gray">
            <div className="sticky top-0 left-0 flex h-screen flex-col">
                <Logo />

                <ul className="-mt-4 grow">
                    {NAVIGATION_ITEMS.map(([title, link, external], i) => {
                        const active = router.pathname === link
                        return (
                            <li
                                key={`navigation-item-${i}`}
                                className={`relative overflow-hidden transition-opacity before:absolute before:top-1 before:bottom-1 before:-left-1 before:block before:w-2 before:rounded-3xl before:bg-tinted-white ${
                                    active
                                        ? ''
                                        : 'before:opacity-0'
                                }`}
                            >
                                <Link
                                    href={link}
                                    target={external ? '_blank' : ''}
                                    className={`flex items-center px-6 py-4 text-sm transition-colors ease-linear hover:text-tinted-white ${
                                        active ? 'text-tinted-white' : 'text-gray-2'
                                    }`}
                                    onClick={toggle}
                                >
                                    {title}
                                    {external && (
                                        <ExternalLinkIcon className="ml-1 h-4 w-4" />
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                <div className="p-6 text-center">
                    <div
                        className="mb-6 flex justify-center md:hidden"
                        onClick={handleSocialLinksClick}
                    >
                        <SocialLinks />
                    </div>
                    <button
                        className="w-full max-w-[208px] rounded-xl bg-dark-gray py-2 text-sm text-gray-2 hover:bg-opacity-80 hover:text-tinted-white"
                        onClick={handleLogoutClick}
                    >
                        {connected ? 'Log Out' : 'Log In'}
                    </button>
                </div>
            </div>
        </div>
    )
}
