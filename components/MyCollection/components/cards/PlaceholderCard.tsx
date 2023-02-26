export default function PlaceholderCard() {
    return (
        <article className="aspect-none flex  flex-col overflow-clip rounded-lg bg-dark-gray sm:aspect-[1/2] md:aspect-[9/5] md:flex-row lg:aspect-[9/4] xl:aspect-[9/5]">
            <div className="relative aspect-square w-full bg-black/50 md:h-full md:w-fit"></div>
            <div className="m-6 flex grow animate-pulse flex-col justify-between">
                <div>
                    <h3 className="h-4 rounded-md bg-tinted-white text-xl tracking-wide"></h3>
                    <div className="mt-4 h-2 animate-pulse rounded bg-tinted-white"></div>
                    <div className="mt-4 h-2 w-1/2 animate-pulse rounded bg-tinted-white"></div>
                </div>
                <div className="mt-2">
                    <div className="h-2 animate-pulse rounded bg-tinted-white"></div>
                    <div className="mt-2 h-2 animate-pulse rounded bg-tinted-white"></div>

                    <button className="mt-4 h-8 w-full animate-pulse rounded border border-tinted-white px-2 cursor-default">
                        <div className="h-2 w-full rounded bg-tinted-white"></div>
                    </button>
                </div>
            </div>
        </article>
    )
}
