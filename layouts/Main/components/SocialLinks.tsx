import { Link } from 'components/shared/Link'
import {
    DISCORD_URL,
    YOUTUBE_URL,
    TWITTER_URL,
    OPENSEA_URL,
} from 'config/constants'
import discordImage from 'public/images/social/discord.png'
import youtubeImage from 'public/images/social/youtube.png'
import twitterImage from 'public/images/social/twitter.png'
import openseaImage from 'public/images/social/opensea.png'
import Image, { StaticImageData } from 'next/image'

const SOCIAL_LINK_ITEMS: [string, string, StaticImageData][] = [
    ['Discord', DISCORD_URL, discordImage],
    ['YouTube', YOUTUBE_URL, youtubeImage],
    ['Twitter', TWITTER_URL, twitterImage],
    ['OpenSea', OPENSEA_URL, openseaImage],
]

export default function () {
    return (
        <ul className="flex items-center gap-4">
            {SOCIAL_LINK_ITEMS.map(([title, link, image], i) => (
                <li className="h-5" key={`social-link-item-${i}`}>
                    <Link href={link} className="hover:opacity-80">
                        <Image title={title} src={image} />
                    </Link>
                </li>
            ))}
        </ul>
    )
}
