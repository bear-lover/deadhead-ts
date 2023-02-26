import Image from 'next/image'

interface AssetImageProps {
    name: string
    image: string
    video?: string
}

export default function AssetImage({ name, image, video }: AssetImageProps) {
    return video ? (
        <video style={{ height: '100%' }} poster={image} loop title={name} controls>
            <source src={video} type="video/mp4" />
        </video>
    ) : image ? (
        <Image
            src={image}
            layout="fill"
            title={name}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
        />
    ) : (
        <div className="flex h-full items-center justify-center bg-black/30 font-vimland text-3xl uppercase text-gray-1" title={name}>
            No Picture
        </div>
    )
}
