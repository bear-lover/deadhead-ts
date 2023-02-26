import { Link } from 'components/shared/Link'
import { DownloadIcon } from '@heroicons/react/outline'

interface PFPDownloadProps {
    downloadLinks: string[]
}

function PFPDownload({ downloadLinks }: PFPDownloadProps) {
    return (
        <div className={`group`}>
            <button className="w-6 rounded bg-black bg-opacity-50 p-0.5">
                <DownloadIcon />
            </button>
            <div className="relative hidden group-hover:block">
                <div
                    className={`absolute w-max bg-tinted-white bg-opacity-75 px-4 text-[10px] text-black`}
                >
                    <Link
                        href={downloadLinks[0]}
                        target="_blank"
                        className="block py-2 hover:scale-105"
                    >
                        Download 2D PFP
                    </Link>
                    <hr className="border-gray-1" />
                    <Link
                        href={downloadLinks[1]}
                        target="_blank"
                        className="block py-2 hover:scale-105"
                    >
                        Download 3D NFT
                    </Link>
                    <hr className="border-gray-1" />
                    <Link
                        href={downloadLinks[2]}
                        target="_blank"
                        className="block py-2 hover:scale-105"
                    >
                        Download 3D Avatar
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PFPDownload
