import Modal from 'components/shared/Modal'
import { useCallback, useMemo } from 'react'
import { StakedTypedToken, Token } from 'config/types'
import { useAccount } from 'providers/token/AccountProvider'
import { useRelease } from 'components/MyCollection/components/release/ReleaseProvider'
import { Loader } from 'components/shared/Loader'
import SelectableTokenList, { defaultRenderItem } from '../SelectableTokenList'

export default function ReleaseDialog() {
    const {
        dialogOpen,
        setDialogOpen,
        tokenType,
        tokens: selectedTokens,
        setTokens: setSelectedTokens,
        rewards,

        releasing,
        startReleasing,
    } = useRelease()

    const selectedTokenIds: string[] = useMemo(
        () => selectedTokens.map(({ id }) => id),
        [selectedTokens]
    )

    const { releasableTokens } = useAccount()
    const tokens: Token[] = useMemo(
        () =>
            tokenType
                ? releasableTokens.filter(({ type }) => type == tokenType)
                : [],
        [tokenType]
    )

    const selectToken = useCallback(
        (token) => {
            setSelectedTokens((tokens) =>
                selectedTokenIds.includes(token.id)
                    ? tokens.filter(({ id }) => id != token.id)
                    : [...tokens, token]
            )
        },
        [selectedTokenIds]
    )

    const selectAll = useCallback(() => {
        setSelectedTokens([...(tokens as StakedTypedToken[])])
    }, [tokens])
    const selectNone = useCallback(() => {
        setSelectedTokens([])
    }, [])

    const handleRelease = useCallback(() => {
        startReleasing()
    }, [startReleasing])

    return (
        <Modal
            title="Release your DeadHeads NFTs"
            description={`You have ${tokens.length} staked NFTs that can be released, allowing you to claim your $SHOW. \nSelect below the NFTs you wish to release.`}
            show={dialogOpen}
            onClose={() => !releasing && setDialogOpen(false)}
        >
            <div className="min-h-[40vh] py-6 md:py-8">
                <div className="mb-4 flex items-center md:mb-6">
                    <button
                        className="font-semibold text-gray-1 hover:text-tinted-white hover:underline focus:underline"
                        onClick={selectAll}
                    >
                        Select All
                    </button>
                    <span className="mx-2 block h-3 w-[2px] bg-gray-1" />
                    <button
                        className="font-semibold text-gray-1 hover:text-tinted-white hover:underline focus:underline"
                        onClick={selectNone}
                    >
                        Select None
                    </button>
                </div>
                <div className="flex min-h-[40vh] flex-wrap gap-2 py-6 md:gap-4 md:py-8">
                    <SelectableTokenList
                        tokens={tokens}
                        selectedTokens={selectedTokens}
                        selectToken={selectToken}
                        renderItem={(token, selected) => (
                            <>
                                {defaultRenderItem(token, selected)}
                                <div className="text-center text-xs text-tinted-white/80">
                                    {(
                                        token as StakedTypedToken
                                    ).stakedInfo.unclaimedRewards.toString()}{' '}
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
                        {rewards.integerValue().toFormat()} $SHOW
                    </span>
                    rewarded
                </div>
                <div className="flex items-center">
                    <button
                        className="w-full rounded-md border-2 border-black bg-tinted-white px-6 py-2 font-vimland text-xl uppercase text-black ring-tinted-white hover:bg-opacity-90 focus:outline-none focus:ring disabled:bg-opacity-100 disabled:opacity-50 md:w-auto md:px-16"
                        disabled={selectedTokenIds.length <= 0 || releasing}
                        onClick={handleRelease}
                    >
                        {releasing && (
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
