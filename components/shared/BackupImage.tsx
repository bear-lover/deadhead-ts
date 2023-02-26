import NextImage from 'next/image'
import {useState} from "react";

export default function BackupImage({ width, height = width, src, className, backup = "/about:blank", responsive = false}) {
    const [imgSrc, setSrc] = useState(src || backup);
    return (
        <NextImage
            className={className}
            layout={responsive? "responsive" : "intrinsic"}
            src={imgSrc}
            width={width}
            height={height}
            alt=''
            onError={() => setSrc(backup)}
        />
    )
}
