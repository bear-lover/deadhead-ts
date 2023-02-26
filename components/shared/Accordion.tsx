import { useCallback, useState } from 'react'
import { ArrowSmUpIcon } from '@heroicons/react/outline'

export default function Accordion({
    items,
    multipleOpen = true,
    splitted = true,
}) {
    const [openStates, setOpenStates] = useState<any[]>([])
    const toggle = useCallback((index) => {
        setOpenStates((states) =>
            states.includes(index)
                ? states.filter((_index) => _index != index)
                : [...(multipleOpen ? states : []), index]
        )
    }, [])

    return (
        <div
            className="accordion space-y-4 md:space-y-6"
            aria-label="Accordion"
        >
            {items.map(({ title, info }, i) => {
                const open = openStates.includes(i)
                return (
                    <div key={`accordion-item-${i}`} className={`collapsible ${
                        splitted
                            ? 'border-b-2 border-tinted-white pb-4 md:pb-6'
                            : ''
                    }`}>
                        <button
                            className={`flex w-full justify-between text-left`}
                            onClick={() => toggle(i)}
                        >
                            <span className="text-small md:text-xl">
                                {title}
                            </span>
                            <ArrowSmUpIcon
                                className="rotate w-6 shrink-0 md:w-7"
                                aria-expanded={open}
                            />
                        </button>
                        <article className="expand" aria-expanded={open}>
                            <div className="pt-3 md:pt-6 whitespace-pre-wrap">
                                {info}
                            </div>
                        </article>
                    </div>
                )
            })}
        </div>
    )
}
