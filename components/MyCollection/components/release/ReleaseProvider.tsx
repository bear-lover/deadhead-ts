import { StakedTypedToken, StakeVersion, TokenType } from 'config/types'
import React, {
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { toast } from 'react-toastify'
import {
    isUserRejectedError,
    parseTransactionError,
    sleep,
} from 'utils/helper.util'
import { useWeb3Connection } from 'providers/Web3ConnectionProvider'
import { useDeadHeads } from 'providers/token/DeadHeadsProvider'
import { useHaloHeads } from 'providers/token/HaloHeadsProvider'
import { useSkullTroopers } from 'providers/token/SkullTroopersProvider'
import { useTransaction } from 'components/transaction/TransactionProvider'
import ReleaseDialog from './ReleaseDialog'
import BigNumber from 'bignumber.js'
import { useShowBiz } from 'providers/token/ShowBizProvider'

interface ReleaseContext {
    dialogOpen: boolean
    setDialogOpen: (open: boolean) => void
    tokenType?: TokenType
    setTokenType: (type: TokenType) => void
    tokens: StakedTypedToken[]
    setTokens: Dispatch<SetStateAction<StakedTypedToken[]>>
    rewards: BigNumber

    releasing: boolean
    startReleasing: () => void
}

const ReleaseContext: React.Context<ReleaseContext> =
    React.createContext<ReleaseContext>({
        dialogOpen: false,
        setDialogOpen: (open: boolean) => {},
        tokenType: undefined,
        setTokenType: (type: TokenType) => {},
        tokens: [],
        setTokens: (tokens: SetStateAction<StakedTypedToken[]>) => {},
        rewards: new BigNumber(0),

        releasing: false,
        startReleasing: () => {},
    })

interface ReleaseProvider {
    children: ReactNode
}

export function ReleaseProvider({ children }: ReleaseProvider) {
    const { connected, account } = useWeb3Connection()

    const deadHeadsProvider = useDeadHeads()
    const skullTroopersProvider = useSkullTroopers()
    const haloHeadsProvider = useHaloHeads()

    const getProvider = useCallback(
        (type: TokenType) => {
            switch (type) {
                case TokenType.STAKED_DEADHEADS:
                    return deadHeadsProvider
                case TokenType.STAKED_SKULLTROOPERS:
                    return skullTroopersProvider
                case TokenType.STAKED_HALOHEADS:
                    return haloHeadsProvider
                default:
                    throw new Error('Invalid token type')
            }
        },
        [deadHeadsProvider, skullTroopersProvider, haloHeadsProvider]
    )

    const [dialogOpen, setDialogOpen] = useState(false)
    const [tokenType, setTokenType] = useState<TokenType>()
    const setTokenTypeTweaked = useCallback(
        (type: TokenType) => {
            const typeStr = type.toString()
            setTokenType(
                typeStr.includes('staked-')
                    ? type
                    : (`staked-${typeStr}` as TokenType)
            )
        },
        [setTokenType]
    )
    const [tokens, setTokens] = useState<StakedTypedToken[]>([])
    const rewards: BigNumber = useMemo(
        () =>
            tokens.reduce(
                (rewards, { stakedInfo }) =>
                    rewards.plus(stakedInfo!.unclaimedRewards),
                new BigNumber(0)
            ),
        [tokens]
    )

    const [releasing, setReleasing] = useState<boolean>(false)
    const {
        openModal: openTransactionModal,
        closeModal: closeTransactionModal,
        moveToNextStep: moveTransactionToNextStep,
        showResult: showTransactionResult,
        showSuccess: showTransactionSuccess,
        showFail: showTransactionFail,
    } = useTransaction()

    const { refresh: refreshShow } = useShowBiz()

    const approveForReleasingV1 = useCallback(
        async (provider) => {
            if (!account || !provider.contract || !provider.stakeV1Contract)
                throw new Error('Approval is needed.')

            let approved = await provider.contract.isApprovedForAll(
                account,
                provider.stakeV1Contract.contractAddress
            )

            !approved &&
                (await provider.contract.setApprovalForAll(
                    account,
                    provider.stakeV1Contract.contractAddress
                ))
        },
        [connected]
    )

    const releaseV1 = useCallback(
        async (provider, tokens: StakedTypedToken[]) => {
            if (!account) return

            return provider.stakeV1Contract.unstakeBatch(
                account,
                tokens.map(({ stakedInfo: { id } }) => id)
            )
        },
        [connected]
    )

    const approveForReleasing = useCallback(
        async (provider) => {
            if (!account || !provider.contract || !provider.stakeContract)
                throw new Error('Approval is needed.')

            let approved = await provider.contract.isApprovedForAll(
                account,
                provider.stakeContract.contractAddress
            )

            !approved &&
                (await provider.contract.setApprovalForAll(
                    account,
                    provider.stakeContract.contractAddress
                ))
        },
        [connected]
    )

    const release = useCallback(
        async (provider, tokens: StakedTypedToken[]) => {
            if (!account) return

            return provider.stakeContract.unstakeBatch(
                account,
                tokens.map(({ id }) => id)
            )
        },
        [connected]
    )

    const startReleasing = useCallback(async () => {
        if (!tokenType) return

        const v1Tokens = tokens.filter(
            ({ stakedInfo: { version } }) => version === StakeVersion.VERSION_1
        )
        const v2Tokens = tokens.filter(
            ({ stakedInfo: { version } }) => version != StakeVersion.VERSION_1
        )

        setReleasing(true)

        setDialogOpen(false)
        await sleep(250)

        let steps: string[] = []
        if (v1Tokens.length) {
            steps = steps.concat([
                'Contract approved for v1 releasing',
                'Transaction pending for v1 releasing',
            ])
        }
        if (v2Tokens.length) {
            steps = steps.concat(['Contract approved', 'Transaction pending'])
        }
        await openTransactionModal('Complete your releasing', steps)

        try {
            const provider = getProvider(tokenType)

            if (v1Tokens.length) {
                await approveForReleasingV1(provider)
                moveTransactionToNextStep()

                await releaseV1(provider, v1Tokens)
                moveTransactionToNextStep()
            }

            if (v2Tokens.length) {
                await approveForReleasing(provider)
                moveTransactionToNextStep()

                await release(provider, v2Tokens)
                moveTransactionToNextStep()
            }

            provider.refreshTokens()
            provider.refreshStakedTokens()
            refreshShow()
            rewards.gt(0) &&
                toast.success(
                    `You've got ${rewards.toString()} $SHOW rewarded.`
                )

            await showTransactionSuccess()
        } catch (ex: any) {
            if (!isUserRejectedError(ex)) {
                console.log(ex)
                const msg = parseTransactionError(ex)
                toast.error(
                    `Error occurred while performing release operation.${
                        msg ? ` (${msg})` : ''
                    }`
                )
                await showTransactionFail()
            }
        } finally {
            closeTransactionModal()
            setReleasing(false)
        }
    }, [tokenType, tokens, getProvider, release, releaseV1])

    return (
        <ReleaseContext.Provider
            value={{
                dialogOpen,
                setDialogOpen,
                tokenType,
                setTokenType: setTokenTypeTweaked,
                tokens,
                setTokens,
                rewards,

                releasing,
                startReleasing,
            }}
        >
            {children}
            <ReleaseDialog />
        </ReleaseContext.Provider>
    )
}

export const useRelease = (): ReleaseContext => {
    const context = useContext<ReleaseContext>(ReleaseContext)
    return context
}
