import { TokenType, Token } from 'config/types'
import React, {
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { toast } from 'react-toastify'
import { isUserRejectedError, parseTransactionError, sleep } from 'utils/helper.util'
import { useWeb3Connection } from 'providers/Web3ConnectionProvider'
import { useDeadHeads } from 'providers/token/DeadHeadsProvider'
import { useHaloHeads } from 'providers/token/HaloHeadsProvider'
import { useSkullTroopers } from 'providers/token/SkullTroopersProvider'
import { useTransaction } from 'components/transaction/TransactionProvider'
import StakeDialog from './StakeDialog'

interface StakeContext {
    dialogOpen: boolean
    setDialogOpen: (open: boolean) => void
    tokenType?: TokenType
    setTokenType: (type: TokenType) => void
    tokens: Token[]
    setTokens: Dispatch<SetStateAction<Token[]>>

    staking: boolean
    startStaking: (months: number) => void
}

const StakeContext: React.Context<StakeContext> =
    React.createContext<StakeContext>({
        dialogOpen: false,
        setDialogOpen: (open: boolean) => {},
        tokenType: undefined,
        setTokenType: (type: TokenType) => {},
        tokens: [],
        setTokens: (tokens: SetStateAction<Token[]>) => {},

        staking: false,
        startStaking: (months: number) => {},
    })

interface StakeProvider {
    children: ReactNode
}

export function StakeProvider({ children }: StakeProvider) {
    const { connected, account } = useWeb3Connection()

    const deadHeadsProvider = useDeadHeads()
    const skullTroopersProvider = useSkullTroopers()
    const haloHeadsProvider = useHaloHeads()

    const getProvider = useCallback(
        (type: TokenType) => {
            switch (type) {
                case TokenType.DEADHEADS:
                    return deadHeadsProvider
                case TokenType.SKULLTROOPERS:
                    return skullTroopersProvider
                case TokenType.HALOHEADS:
                    return haloHeadsProvider
                default:
                    throw new Error('Invalid token type')
            }
        },
        [deadHeadsProvider, skullTroopersProvider, haloHeadsProvider]
    )

    const [dialogOpen, setDialogOpen] = useState(false)
    const [tokenType, setTokenType] = useState<TokenType>()
    const [tokens, setTokens] = useState<Token[]>([])

    const [staking, setStaking] = useState<boolean>(false)
    const {
        openModal: openTransactionModal,
        closeModal: closeTransactionModal,
        moveToNextStep: moveTransactionToNextStep,
        showResult: showTransactionResult,
        showSuccess: showTransactionSuccess,
        showFail: showTransactionFail,
    } = useTransaction()

    const approveForStaking = useCallback(
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

    const stake = useCallback(
        async (provider, tokens: Token[], months: number) => {
            if (!account) return

            return provider.stakeContract.stake(
                account,
                tokens.map(({ id }) => id),
                months
            )
        },
        [connected]
    )

    const startStaking = useCallback(
        async (months: number) => {
            if (!tokenType) return

            setStaking(true)

            setDialogOpen(false)
            await sleep(250)

            await openTransactionModal('Complete your staking', [
                'Contract approved',
                'Transaction pending',
            ])

            try {
                const provider = getProvider(tokenType)

                await approveForStaking(provider)

                moveTransactionToNextStep()

                await stake(provider, tokens, months)

                moveTransactionToNextStep()

                provider.refreshTokens()
                provider.refreshStakedTokens()
                // toast.success('Staking succcess!!!')

                await showTransactionSuccess()
            } catch (ex: any) {
                if (!isUserRejectedError(ex)) {
                    console.log(ex)
                    const msg = parseTransactionError(ex)
                    toast.error(
                        `Error occurred while performing stake operation.${
                            msg ? ` (${msg})` : ''
                        }`
                    )
                    await showTransactionFail()
                }
            } finally {
                closeTransactionModal()
                setStaking(false)
            }
        },
        [tokenType, tokens, getProvider, approveForStaking, stake]
    )

    return (
        <StakeContext.Provider
            value={{
                dialogOpen,
                setDialogOpen,
                tokenType,
                setTokenType,
                tokens,
                setTokens,

                staking,
                startStaking,
            }}
        >
            {children}
            <StakeDialog />
        </StakeContext.Provider>
    )
}

export const useStake = (): StakeContext => {
    const context = useContext<StakeContext>(StakeContext)
    return context
}
