import React, { useEffect, useState } from 'react'
import Logo from './Logo'
import Account from './Account'
import SocialLinks from './SocialLinks'
import Shortcuts from './Shortcuts'

export default function Header() {
    const [scrolling, setScrolling] = useState<boolean>()
    useEffect(() => {
        function onScroll() {
            // if (window.innerWidth < 768) {
            //     setScrolling(false)
            //     return
            // }

            setScrolling(window.scrollY > 60)
        }

        window.addEventListener('scroll', onScroll)
        window.addEventListener('resize', onScroll)

        onScroll()

        return function () {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
        }
    }, [])

    return (
        <header
            className={`pt-[100.02px] transition-all md:sticky md:top-0 md:left-0 md:z-40 md:pt-0`}
        >
            <div className={`fixed top-0 z-40 w-full bg-black md:hidden ${
                    scrolling
                        ? 'bg-opacity-75 shadow-lg shadow-tinted-white/10'
                        : ''
                }`}>
                <Logo scrolling={scrolling} />
            </div>
            <div
                className={`flex grow flex-row flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 pb-4 transition-all md:px-8 bg-black ${
                    scrolling
                        ? 'md:bg-opacity-75 md:shadow-lg md:shadow-tinted-white/10 md:py-4'
                        : 'md:py-12'
                }`}
            >
                <Account />
                <div className="hidden items-center gap-16 md:flex">
                    <Shortcuts />
                    <SocialLinks />
                </div>
            </div>
        </header>
    )
}
