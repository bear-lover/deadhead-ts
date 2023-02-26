import { TokenType, TypedToken } from 'config/types'
import { useCallback, useMemo } from 'react'
import GenericAssetCard from './GenericAssetCard'
import { useStake } from '../stake/StakeProvider'
import { useBurn } from '../burn/BurnProvider'
import { PFP_DOWNLOADABLE_TYPES, PFP_DOWNLOAD_LINKS } from 'config/constants'
import PFPDownload from './PFPDownload'

interface AssetCardProps {
    token: TypedToken
}
export default function AssetCard({ token }: AssetCardProps) {
    const {
        setDialogOpen: setStakeDialogOpen,
        setTokenType: setStakingTokenType,
        setTokens: setSelectedStakingTokens,
    } = useStake()

    const {
        setDialogOpen: setBurnDialogOpen,
        setDeadHeads: setSelectedDeadHeads,
    } = useBurn()
    const handleStakeClick = useCallback(() => {
        setStakingTokenType(token.type)
        setSelectedStakingTokens([token])
        setStakeDialogOpen(true)
    }, [])

    const handleBurnClick = useCallback(() => {
        setSelectedDeadHeads([token])
        setBurnDialogOpen(true)
    }, [])

    return (
        <GenericAssetCard
            token={token}
            renderOnImage={
                PFP_DOWNLOADABLE_TYPES.includes(token.type) && (
                    <div className="absolute top-4 left-4">
                        <PFPDownload
                            downloadLinks={PFP_DOWNLOAD_LINKS[token.type].map(
                                (link) => link.replace('{ID}', token.id)
                            )}
                        />
                    </div>
                )
            }
        >
            <div className="space-y-3">
                {/* {downloadable && (
                    <button className="block w-full border border-white bg-transparent py-2 text-center text-[10px] transition ease-in-out hover:bg-white hover:text-gray-1 md:hidden">
                        2D &amp; 3D PFP
                    </button>
                )} */}
                <button
                    className="block w-full border border-white bg-transparent py-2 text-center text-[10px] uppercase transition ease-in-out hover:bg-white hover:text-gray-1"
                    onClick={handleStakeClick}
                >
                    Stake
                </button>
                {token.type === TokenType.DEADHEADS && (
                    <button
                        className={`block w-full border border-white bg-transparent py-2 text-center text-[10px] uppercase transition ease-in-out hover:bg-white hover:text-gray-1`}
                        onClick={handleBurnClick}
                    >
                        Buy DeadTicket &amp; Burn
                    </button>
                )}
            </div>
        </GenericAssetCard>
    )
}
