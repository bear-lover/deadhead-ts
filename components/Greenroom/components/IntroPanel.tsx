export default function IntroPanel({ link, episode }) {
    return (
        <section className="rounded-2xl bg-dark-gray p-4 md:p-7">
            <h2 className="mb-6 text-2xl md:text-3xl">green room</h2>
            <article className="lg:grid grid-cols-11 gap-16">
                <div className="col-span-4 ">
                    <p className="text-sm">
                        Fusce dapibus, tellus ac cursus commodo, tortor mauris
                        condimentum nibh, ut fermentum massa justo sit amet
                        risus. Fusce dapibus, tellus ac cursus commodo, tortor
                        mauris condimentum nibh, ut fermentum massa justo sit
                        amet risus. Nullam quis risus eget urna mollis ornare
                        vel eu leo. Integer posuere erat a ante venenatis
                        dapibus posuere velit aliquet.
                    </p>
                    <button className="mt-6 w-full lg:w-fit whitespace-nowrap border border-white bg-transparent py-4 px-5 text-center text-[10px] uppercase hover:bg-white hover:text-dark-gray">
                        {`mint ${episode} for free`}
                    </button>
                </div>

                <iframe
                    className="col-span-7 aspect-[16/10] w-full mt-6 lg:mt-0"
                    src={link}
                />
            </article>
        </section>
    )
}