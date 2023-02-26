import { Link } from 'components/shared/Link'
import { DISCORD_URL, YOUTUBE_URL } from 'config/constants'

const SHORTCUT_ITEMS = [
    ['Discord', DISCORD_URL, true],
    ['Episodes', YOUTUBE_URL, true],
    ['FAQs', '/faqs'],
]

export default function () {
    return (
        <ul className="flex items-center gap-8">
            {SHORTCUT_ITEMS.map(([title, link, external], i) => (
                <li key={`shortcut-item-${i}`} className='leading-none'>
                    <Link
                        href={link}
                        target={external ? '_blank' : ''}
                        className="text-xl text-tinted-white font-vimland leading-none uppercase hover:underline"
                    >
                        {title}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
