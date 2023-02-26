import { useState } from 'react'
import { ArrowSmUpIcon } from '@heroicons/react/solid'

export default function Collapsible({ title, children, outlined = true }) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <section
            className={`collapsible ${
                outlined
                    ? 'rounded-xl border border-gray-2 p-4 transition hover:border-tinted-white focus:border-tinted-white md:p-6'
                    : ''
            }`}
            aria-label="Collapsible"
        >
            <button
                className="flex w-full cursor-pointer items-center justify-between text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-vimland text-2xl uppercase tracking-wide md:text-3xl">
                    {title}
                </span>
                <ArrowSmUpIcon
                    className={`rotate w-6 md:w-8`}
                    aria-expanded={isOpen}
                />
            </button>
            <div className="expand" aria-expanded={isOpen}>
                {children}
            </div>
        </section>
    )
}
