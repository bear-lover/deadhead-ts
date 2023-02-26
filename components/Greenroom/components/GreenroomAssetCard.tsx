import BigNumber from 'bignumber.js'
import AssetImage from 'components/shared/AssetImage'
import { Loader } from 'components/shared/Loader'
import { GreenroomToken, GreenroomV2Item } from 'config/types'
import { useGreenroomV2 } from 'providers/token/GreenroomV2Provider'
import { useCallback, useMemo } from 'react'
import Web3 from 'web3'

interface GreenroomAssetCardProps {
    item: GreenroomV2Item
}

export default function GreenroomAssetCard({ item }: GreenroomAssetCardProps) {
    const {
        id,
        image,
        video,
        name,
        price,
        purchaseType,
        maxSupply,
        mintLimit,
        totalSupply,
        description,
    } = item
    const remaining = useMemo(() => maxSupply - totalSupply, [item])
    const { minting, mintingId, startMinting, tokens } = useGreenroomV2()

    const balance = useMemo(() => {
        const token = tokens.find(({ id: _id }) => id == _id)
        return token ? (token as GreenroomToken).balance : 0
    }, [tokens])

    const handleMint = useCallback(() => {
        startMinting(item, 1)
    }, [item, startMinting])

    return (
        <article className="flex h-full flex-col justify-between space-y-4 rounded-lg bg-dark-gray p-6 text-xs">
            <div className="space-y-2.5">
                {/* <img className="w-full" src={image} title={name} alt={name} /> */}
                <div className="relative aspect-square w-full">
                    <AssetImage
                        name={name}
                        image={image}
                        video={video}
                    />
                </div>
                <div>
                    <p>{name}</p>
                    <p className="text-gray-2">{description}</p>
                </div>
                <p className="text-gray-2">
                    Price: $
                    {`${purchaseType == 0 ? 'ETH' : 'SHOW'} ${new BigNumber(
                        Web3.utils.fromWei(price, 'ether')
                    ).toFormat()}`}
                </p>
                <p className="text-gray-2">
                    Remaining: {remaining} / {maxSupply}
                </p>
                <p className="text-gray-2">Max mint per wallet: {mintLimit}</p>
                <p className="text-gray-2">Your Balance: {balance}</p>
            </div>
            <div>
                <button
                    className="w-full border border-white bg-transparent py-2 text-center text-[10px] uppercase transition ease-in-out hover:bg-white hover:text-gray-1 disabled:border-gray-1 disabled:bg-transparent disabled:text-gray-1"
                    disabled={
                        balance >= Math.min(mintLimit, remaining) || minting
                    }
                    onClick={handleMint}
                >
                    {mintingId == id && (
                        <div className="mr-2">
                            <Loader height="16px" />
                        </div>
                    )}
                    Mint
                </button>
            </div>
        </article>
    )
}
