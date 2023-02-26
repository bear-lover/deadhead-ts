import Image from 'next/image'
import Modal from 'components/shared/Modal'
import { useCallback, useMemo, useState } from 'react'
import StakePeriodSelect from '../StakePeriodSelect'
import { STAKE_PERIODS } from 'config/constants'
import { Token, TypedToken } from 'config/types'
import { useAccount } from 'providers/token/AccountProvider'
import { useStake } from 'components/MyCollection/components/stake/StakeProvider'
import { Loader } from 'components/shared/Loader'
import SelectableTokenList from '../SelectableTokenList'

export default function StakeDialog() {
    const {
        dialogOpen,
        setDialogOpen,
        tokenType,
        tokens: selectedTokens,
        setTokens: setSelectedTokens,

        staking,
        startStaking,
    } = useStake()
    const selectedTokenIds: string[] = useMemo(
        () => selectedTokens.map(({ id }) => id),
        [selectedTokens]
    )

    const { tokens: allTokens } = useAccount()
    const tokens: Token[] = useMemo(
        () =>
            tokenType ? allTokens.filter(({ type }) => type == tokenType) : [],
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
        setSelectedTokens([...tokens])
    }, [tokens])
    const selectNone = useCallback(() => {
        setSelectedTokens([])
    }, [])

    const [agreed, setAgreed] = useState<boolean>()
    const [period, setPeriod] = useState(STAKE_PERIODS[0])

    useMemo(() => {
        setAgreed(false)
        setPeriod(STAKE_PERIODS[2])
    }, [dialogOpen])

    const handleStake = useCallback(() => {
        startStaking(period)
    }, [period, startStaking])

    return (
        <Modal
            title="Stake your DeadHeads NFTs"
            description={`Stake your NFT to be cast in animated episodes, manga, commercials and more! \nAdditionally, you will earn $SHOW that can be used to claim digital tokens within the ecosystem. \n\nSelect the NFTs you wish to stake and how long you wish to stake them for.`}
            show={dialogOpen}
            onClose={() => !staking && setDialogOpen(false)}
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
                <div className="flex flex-wrap gap-2 md:gap-4">
                    <SelectableTokenList
                        tokens={tokens}
                        selectedTokens={selectedTokens}
                        selectToken={selectToken}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-between gap-4 rounded-xl bg-black p-4 shadow-xl shadow-black/10 lg:flex-row">
                <div className="flex flex-col md:flex-row items-center justify-center">
                    You are about to stake {selectedTokenIds.length} tokens for
                    <div className="mx-2">
                        <StakePeriodSelect
                            period={period}
                            setPeriod={setPeriod}
                            disabled={staking}
                        />
                    </div>
                    months
                </div>
                <div className="flex flex-col md:flex-row items-center gap-x-16 gap-y-4 justify-center lg:justify-end">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2 h-5 w-5"
                            checked={agreed}
                            disabled={staking}
                            onChange={(e) => setAgreed(!agreed)}
                        />{' '}
                        Staking &amp; license agreement
                    </label>
                    <button
                        className="w-full rounded-md border-2 border-black bg-tinted-white px-6 py-2 font-vimland text-xl uppercase text-black ring-tinted-white hover:bg-opacity-90 focus:outline-none focus:ring disabled:bg-opacity-100 disabled:opacity-50 md:w-auto md:px-16"
                        disabled={
                            selectedTokenIds.length <= 0 || !agreed || staking
                        }
                        onClick={handleStake}
                    >
                        {staking && (
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
