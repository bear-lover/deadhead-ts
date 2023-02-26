import { ReactNode, useMemo } from 'react'
import AssetImage from 'components/shared/AssetImage'
import { Token } from 'config/types'

interface GenericAssetCardProps {
    token: Token
    renderOnImage?: ReactNode
    children?: ReactNode
}
export default function GenericAssetCard({
    token: { name, image, video },
    renderOnImage,
    children,
}: GenericAssetCardProps) {
    return (
        <article className="aspect-none flex flex-col overflow-clip rounded-lg bg-dark-gray sm:aspect-[1/2] md:aspect-[9/5] md:flex-row lg:aspect-[9/4] xl:aspect-[9/5]">
            <div className="relative aspect-square w-full bg-black/50 md:h-full md:w-fit">
                <AssetImage name={name} image={image} video={video} />
                {renderOnImage}
            </div>
            <div className="m-6 flex grow flex-col justify-between">
                <h3 className="text-xl tracking-wide">{name}</h3>
                <div className="mt-2">{children}</div>
            </div>
        </article>
    )
}
