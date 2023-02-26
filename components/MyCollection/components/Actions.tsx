import BigNumber from 'bignumber.js'
import { TokenType } from 'config/types'
import { useAccount } from 'providers/token/AccountProvider'
import { useCallback } from 'react'
import { useClaim } from './claim/ClaimProvider'
import { useRelease } from './release/ReleaseProvider'
import { useTypeSelect } from './type-select/TypeSelectProvider'

export default function () {
    const { claimableRewards, releasableTokens } = useAccount()

    const { setDialogOpen: setClaimDialogOpen } = useClaim()

    const releaseContext = useRelease()

    const {
        setTokenType: setTypeSelectorTokenType,
        openWithConsumer: openTypeSelectDialog,
    } = useTypeSelect()

    const handleClaimClick = useCallback(() => {
        setClaimDialogOpen(true)
    }, [])

    const handleReleaseClick = useCallback(() => {
        setTypeSelectorTokenType(TokenType.NONE)
        openTypeSelectDialog(releaseContext)
    }, [])

    return (
        <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-6">
            <button
                className="w-full whitespace-nowrap border-[1.35px] border-tinted-white py-3 px-3 text-center font-vimland text-2xl uppercase text-tinted-white hover:bg-white hover:text-dark-gray disabled:border-gray-2 disabled:bg-transparent disabled:text-gray-2"
                disabled={!claimableRewards.gt(new BigNumber(0))}
                onClick={handleClaimClick}
            >
                Claim Show Rewards
            </button>
            <button
                // disabled={!releasableTokens.length}
                className="w-full whitespace-nowrap border-[1.35px] border-tinted-white py-3 px-3 text-center font-vimland text-2xl uppercase text-tinted-white hover:bg-white hover:text-dark-gray disabled:border-gray-2 disabled:bg-transparent disabled:text-gray-2"
                onClick={handleReleaseClick}
            >
                Release + Claim $SHOW
            </button>
        </div>
    )
}
