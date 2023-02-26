import { createRef, useRef } from 'react'
import Accordion from 'components/shared/Accordion'

export default function FAQs({ sections }) {
    const refs = useRef(
        Array.from({ length: sections.length }, () =>
            createRef<HTMLDivElement>()
        )
    )
    return (
        <div className="rounded-lg md:flex md:bg-dark-gray md:p-6">
            <div className="rounded-xl bg-dark-gray p-4 md:hidden">
                <h2 className="text-2xl">faqs</h2>
            </div>
            <section className="sticky top-6 hidden h-fit w-2/6 md:block">
                <h2 className="text-3xl">faqs</h2>
                <div className="mt-12 space-y-4 ">
                    {sections.map(({ heading }, i) => (
                        <p
                            key={`faq-menu-item-${i}`}
                            className="text-gray-2 transition-colors ease-linear hover:cursor-pointer hover:text-tinted-white"
                            onClick={() => {
                                refs.current[i].current?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start',
                                })
                            }}
                        >
                            {heading}
                        </p>
                    ))}
                </div>
            </section>
            <div className="w-full">
                {sections.map(({ heading, items }, i) => (
                    <section
                        className="mt-4 rounded-xl bg-dark-gray px-4 py-6 md:mt-12"
                        key={`faq-section-${i}`}
                        ref={refs.current[i]}
                    >
                        <h3 className="text-center text-2xl md:py-4 md:text-left md:text-5xl">
                            {heading}
                        </h3>
                        <div className="mt-4 md:mt-6">
                            <Accordion items={items} />
                        </div>
                    </section>
                ))}
            </div>
        </div>
    )
}
