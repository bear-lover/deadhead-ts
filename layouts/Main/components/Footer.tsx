import React from 'react'
import { useRouter } from 'next/router'
import { Link } from 'components/shared/Link'

export default function Footer() {
    const router = useRouter()

    return (
        <div className="px-8 py-6">
            <div className=" flex flex-col items-center justify-between gap-6 text-center md:flex-row">
                <div className="flex flex-col text-xs text-gray-1 md:flex-row md:gap-4">
                    <Link href="/terms" className="hover:text-tinted-white">
                        Terms &amp; Conditions
                    </Link>
                    <Link href="/policy" className="hover:text-tinted-white">
                        Privacy Policy
                    </Link>
                </div>
                <Link
                    href="https://www.gmistudios.io/"
                    className="transition ease-in-out hover:opacity-80"
                    target="_blank"
                >
                    <img
                        src="/images/gmistudios-logo.png"
                        alt="GMIStudios"
                        className="h-[15px] object-contain"
                    />
                </Link>
            </div>
        </div>
    )
}
