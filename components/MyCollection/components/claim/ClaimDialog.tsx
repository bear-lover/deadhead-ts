import Image from 'next/image'
import Modal from 'components/shared/Modal'
import { useClaim } from './ClaimProvider'
import SelectableTokenList, { defaultRenderItem } from '../SelectableTokenList'
import { Loader } from 'components/shared/Loader'
import { useAccount } from 'providers/token/AccountProvider'
import { useCallback } from 'react'
import { StakedTypedToken } from 'config/types'

export default function ClaimDialog() {
    const {
        dialogOpen,
        setDialogOpen,
        tokens,

        claiming,
        startClaiming,
    } = useClaim()

    const { claimableRewards } = useAccount()

    const handleClaim = useCallback(() => {
        startClaiming()
    }, [startClaiming])

    return (
        <Modal
            title="Claim Show Rewards"
            description={`You have ${tokens.length} staked NFTs that you can claim your $SHOW from.`}
            show={dialogOpen}
            onClose={() => !claiming && setDialogOpen(false)}
        >
            <div className="min-h-[40vh] py-6 md:py-8">
                <div className="flex min-h-[40vh] flex-wrap gap-2 py-6 md:gap-4 md:py-8">
                    <SelectableTokenList
                        tokens={tokens}
                        renderItem={(token, selected) => (
                            <>
                                {defaultRenderItem(token, selected, false)}
                                <div className="text-center text-xs text-tinted-white/80">
                                    {(
                                        token as StakedTypedToken
                                    ).stakedInfo.unclaimedRewards.integerValue().toFormat()}{' '}
                                    $SHOW
                                </div>
                            </>
                        )}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-between gap-4 rounded-xl bg-black p-4 shadow-xl shadow-black/10 md:flex-row">
                <div className="flex items-center justify-center">
                    You will get
                    <span className="mx-2 rounded-md border border-tinted-white p-2 text-center">
                        {claimableRewards.integerValue().toFormat()} $SHOW
                    </span>
                    rewarded
                </div>
                <div className="flex items-center">
                    <button
                        className="w-full rounded-md border-2 border-black bg-tinted-white px-6 py-2 font-vimland text-xl uppercase text-black ring-tinted-white hover:bg-opacity-90 focus:outline-none focus:ring disabled:bg-opacity-100 disabled:opacity-50 md:w-auto md:px-16"
                        disabled={claiming}
                        onClick={handleClaim}
                    >
                        {claiming && (
                            <div className="mr-2">
                                <Loader />
                            </div>
                        )}
                        Continue
                    </button>
                </div>
            </div>
        </Modal>
    )
}
