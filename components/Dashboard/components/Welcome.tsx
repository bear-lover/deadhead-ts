import { useState } from 'react'
import { XIcon } from '@heroicons/react/outline'
import { Link } from 'components/shared/Link'
import { DEADHEADS_COLLECTION_URL, DISCORD_URL, OPENSEA_URL, TWITTER_URL } from 'config/constants'
import Image from 'next/image'
import discordImage from 'public/images/social/discord.png'
import twitterImage from 'public/images/social/twitter.png'

export default function () {
    const [visible, setVisible] = useState<boolean>(true)

    return visible ? (
        <div className="relative rounded-lg bg-dark-gray p-4 md:p-6">
            <XIcon
                className="absolute top-4 right-4 h-6 w-6 cursor-pointer hover:opacity-80 md:top-6 md:right-6 md:h-10 md:w-10"
                onClick={() => setVisible(false)}
            />
            <h2 className="text-[22px] md:text-[40px]">WELCOME TO HELL</h2>
            <p className="mt-4 text-sm md:text-lg">
                An unholy union of YouTube series, ownable characters and online
                community.
                <br />
                <br />
                Deadheads is the first ever animated series where the fans can
                own the characters. By buying the NFT of an original Deadhead,
                you can give them the chance to appear on the show, make and
                sell merch, or simply turn them into a 3D model to darken the
                vibe of your mantlepiece. <br />
                <br />
                Connect your wallet &amp; join the underworld.
            </p>
            <div className="mt-8 flex flex-col items-center gap-x-16 gap-y-8 lg:flex-row lg:justify-between">
                <Link
                    href={DEADHEADS_COLLECTION_URL}
                    className="w-full whitespace-nowrap border border-white bg-transparent py-3 px-3 text-center text-sm uppercase hover:bg-white hover:text-dark-gray lg:w-auto lg:px-16"
                >
                    DeadHeads on OpenSea
                </Link>
                <div className="flex w-full flex-col flex-wrap gap-x-8 gap-y-4 lg:gap-y-2 lg:w-auto lg:flex-row">
                    <Link
                        href={DISCORD_URL}
                        className="flex items-center text-sm text-tinted-white opacity-50 hover:opacity-100"
                    >
                        <Image
                            title="Find a new life in the Discord"
                            src={discordImage}
                        />
                        <span className="ml-4">
                            Find a new life in the Discord
                        </span>
                    </Link>
                    <Link
                        href={TWITTER_URL}
                        className="flex items-center text-sm text-tinted-white opacity-50 hover:opacity-100"
                    >
                        <Image
                            title="Watch Twitter burn to hell"
                            src={twitterImage}
                        />
                        <span className="ml-4">Watch Twitter burn to hell</span>
                    </Link>
                </div>
            </div>
        </div>
    ) : (
        <></>
    )
}
