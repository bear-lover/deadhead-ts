import { Link } from '../../shared/Link'

export default function ProjectCard({
    projectInfo: {
        title,
        user,
        userLink,
        thumbnail,
        description,
        link,
        linkTitle,
    },
}) {
    return (
        <article className="relative w-full break-inside-avoid space-y-4 rounded-lg bg-dark-gray p-7">
            <h4 className="-mb-2.5 text-2xl">{title}</h4>
            <Link
                href={userLink}
                className="text-xs text-gray-2 transition-colors hover:text-tinted-white focus:text-tinted-white"
            >
                by {user}
            </Link>
            <img src={thumbnail} title={title} alt="thumbnail" />
            <p className="text-sm">{description}</p>
            <Link
                href={link}
                className="block border border-white bg-transparent py-2 text-center text-[10px] transition ease-in-out hover:bg-white hover:text-gray-1 md:w-3/5"
            >
                {linkTitle}
            </Link>
        </article>
    )
}
