import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { InView } from 'react-intersection-observer'
import { Link } from './Link'
import { Token } from 'config/types'
import AssetImage from './AssetImage'
import { isAbsoluteURI } from 'utils/helper.util'

interface AssetShelfProps {
    title: string
    assets?: Token[]
    loading?: boolean
    collectionUrl: string
    collectionTitle?: string
}
export default function AssetShelf({
    title,
    assets = [],
    loading = true,
    collectionUrl,
    collectionTitle = 'View on OpenSea',
}: AssetShelfProps) {
    const scroll = useRef<HTMLUListElement>(null)
    const [leftButtonVisible, setLeftButtonVisible] = useState(false)
    const [rightButtonVisible, setRightButtonVisible] = useState(false)

    const updateScroll = useCallback(() => {
        const cur = scroll.current
        if (!cur) return

        // Show/Hide left arrow
        setLeftButtonVisible(cur.scrollLeft !== 0)
        // Show/Hide right arrow
        setRightButtonVisible(
            cur.scrollLeft !== cur.scrollWidth - cur.clientWidth
        )
    }, [scroll])

    useEffect(() => {
        const cur = scroll.current
        if (!cur) return

        cur.addEventListener('scroll', updateScroll)
        window.addEventListener('resize', updateScroll)

        return () => {
            cur.removeEventListener('scroll', updateScroll)
            window.removeEventListener('resize', updateScroll)
        }
    }, [scroll])
    useEffect(() => {
        updateScroll()
    }, [assets])
    return (
        <section className="rounded-lg bg-dark-gray p-4 md:p-6">
            <div className="mb-4 flex w-full items-center justify-between md:mb-8">
                <h2 className="text-[22px] lg:text-[40px]">{title}</h2>
                <Link
                    href={collectionUrl || '/'}
                    target={isAbsoluteURI(collectionUrl) ? '_blank' : ''}
                    className="hidden w-32 items-center justify-center border border-white py-2 text-center text-[10px] uppercase hover:bg-white hover:text-dark-gray md:flex"
                >
                    {collectionTitle}
                </Link>
            </div>
            <div className="relative">
                <button
                    className={
                        'absolute -left-4 top-1/2 z-10  -mt-[39px] w-6 hover:scale-110 focus:scale-110 md:-left-6 md:-mt-[48px] md:w-12 ' +
                        (!leftButtonVisible ? ' hidden' : '')
                    }
                    onClick={() =>
                        scroll.current?.scrollBy(-scroll.current.clientWidth, 0)
                    }
                >
                    <ChevronLeftIcon />
                </button>
                <ul
                    className="flex w-auto snap-x snap-mandatory space-x-8 overflow-y-hidden overflow-x-scroll scroll-smooth text-xs scrollbar-hide"
                    ref={scroll}
                >
                    {(loading ? Array(8).fill(null) : assets).map(
                        (asset, i) => (
                            <InView
                                key={`asset-shelf-item-${title
                                    .toLowerCase()
                                    .replace(/\s/, '-')}-${i}`}
                            >
                                {({ inView, ref }) => (
                                    <li
                                        className="flex snap-center flex-col"
                                        ref={ref}
                                        aria-hidden={inView}
                                    >
                                        {loading ? (
                                            <AssetPlaceholder />
                                        ) : (
                                            <Asset asset={asset} />
                                        )}
                                    </li>
                                )}
                            </InView>
                        )
                    )}
                </ul>
                <button
                    className={
                        'absolute -right-4 top-1/2 z-10 -mt-[39px] w-6 hover:scale-110 focus:scale-110 md:-right-6 md:-mt-[48px] md:w-12 ' +
                        (!rightButtonVisible ? ' hidden' : '')
                    }
                    onClick={() =>
                        scroll.current?.scrollBy(scroll.current.clientWidth, 0)
                    }
                >
                    <ChevronRightIcon />
                </button>
            </div>
        </section>
    )
}

function AssetPlaceholder() {
    return (
        <div className="animate-pulse">
            <div className="relative aspect-square w-[255px] md:w-[237px]">
                <Image
                    src={
                        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
                    }
                    layout="fill"
                />
            </div>
            <div className="mt-3">
                <p className="h-4 bg-black"></p>
                <div className="mt-3 h-[26px] bg-black md:my-1 md:h-4"></div>
            </div>
        </div>
    )
}

function Asset({ asset: { name, image, url, video, staked } }) {
    return (
        <div className="">
            <div className="relative aspect-square w-[255px] md:w-[237px]">
                <Link href={url} target="_blank">
                    <AssetImage name={name} image={image} video={video} />
                    {staked && (
                        <p className="absolute top-4 right-4 rounded-full bg-tinted-white py-0.5 px-2 text-[10px] font-bold text-black">
                            STAKED
                        </p>
                    )}
                </Link>
            </div>
            <div className="mt-3">
                <Link href={url} target="_blank">
                    <p className="text-center md:text-left">{name}</p>
                </Link>
                <Link
                    href={url}
                    target="_blank"
                    className="mx-8 mt-3 block border border-white bg-transparent px-4 py-1 text-center text-[10px] uppercase text-white transition-colors hover:bg-white hover:text-gray-1 focus:bg-white focus:text-gray-1 md:mx-0 md:my-0 md:mt-0 md:border-none md:px-0 md:text-left md:text-xs md:normal-case md:text-gray-1 md:hover:bg-transparent md:hover:text-tinted-white md:focus:bg-transparent md:focus:text-tinted-white "
                >
                    View on OpenSea
                </Link>
            </div>
        </div>
    )
}
