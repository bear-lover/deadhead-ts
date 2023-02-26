import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'

export function LoadMoreList({ items, renderItems, load, start = load, placeholder = <></> }) {
    const [size, setSize] = useState(start)

    const loadMore = () => {
        setSize((prev) => prev + load)
    }
    return (
        <>
            {items.length ? (
                items?.slice(0, size).map(renderItems)
            ) : (
                placeholder
            )}
            {size < items.length ? (
                <button
                    className="flex mx-auto"
                    onClick={loadMore}
                >
                    <ChevronDownIcon className="h-[24px] w-[24px] text-light-gray" />
                    LOAD MORE
                </button>
            ) : (
                <></>
            )}
        </>
    )
}
