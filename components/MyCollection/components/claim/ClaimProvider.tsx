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
import { isUserRejectedError, parseTransactionError, sleep } from 'utils/helper.util'
import { useWeb3Connection } from 'providers/Web3ConnectionProvider'
import { useTransaction } from 'components/transaction/TransactionProvider'
import ClaimDialog from './ClaimDialog'
import BigNumber from 'bignumber.js'
import { useShowBiz } from 'providers/token/ShowBizProvider'
import StakeV1ContractService from 'services/contract/stake-v1.contract.service'
import StakeV2ContractService from 'services/contract/stake-v2.conract.service'
import { useAccount } from 'providers/token/AccountProvider'

interface ClaimContext {
    dialogOpen: boolean
    setDialogOpen: (open: boolean) => void

    tokens: StakedTypedToken[]

    claiming: boolean
    startClaiming: () => void
}

const ClaimContext: React.Context<ClaimContext> =
    React.createContext<ClaimContext>({
        dialogOpen: false,
        setDialogOpen: (open: boolean) => {},

        tokens: [],

        claiming: false,
        startClaiming: () => {},
    })

interface ClaimProvider {
    children: ReactNode
}

export function ClaimProvider({ children }: ClaimProvider) {
    const { connected, account, web3 } = useWeb3Connection()
    const {
        stakedTokens,
        claimableRewards,
        refresh: refreshAllTokens,
    } = useAccount()
    const tokens = useMemo(
        () =>
            stakedTokens.filter(({ stakedInfo }) =>
                stakedInfo.unclaimedRewards.gt(new BigNumber(0))
            ),
        [stakedTokens]
    )

    const stakeV1Contract = useMemo(
        () => (web3 ? new StakeV1ContractService(web3) : undefined),
        [web3]
    )
    const stakeContract = useMemo(
        () => (web3 ? new StakeV2ContractService(web3) : undefined),
        [web3]
    )

    const [dialogOpen, setDialogOpen] = useState(false)

    const [claiming, setClaiming] = useState<boolean>(false)
    const {
        openModal: openTransactionModal,
        closeModal: closeTransactionModal,
        moveToNextStep: moveTransactionToNextStep,
        showResult: showTransactionResult,
        showSuccess: showTransactionSuccess,
        showFail: showTransactionFail,
    } = useTransaction()

    const { refresh: refreshShow } = useShowBiz()

    const claimV1 = useCallback(async () => {
        if (!account || !stakeV1Contract) return

        return stakeV1Contract.claimRewards(account)
    }, [connected])

    const claim = useCallback(async () => {
        if (!account || !stakeContract) return

        return stakeContract.claimRewards(account)
    }, [connected])

    const startClaiming = useCallback(async () => {
        const v1Tokens = tokens.filter(
            ({ stakedInfo: { version } }) => version === StakeVersion.VERSION_1
        )
        const v2Tokens = tokens.filter(
            ({ stakedInfo: { version } }) => version != StakeVersion.VERSION_1
        )

        setClaiming(true)

        setDialogOpen(false)
        await sleep(250)

        await openTransactionModal(
            'Complete your claiming',
            [
                (v1Tokens.length && 'Transaction pending for v1 claiming') || '',
                (v2Tokens.length && 'Transaction pending') || '',
            ].filter((step) => step)
        )

        try {
            if (v1Tokens.length) {
                await claimV1()
                moveTransactionToNextStep()
            }

            if (v2Tokens.length) {
                await claim()
                moveTransactionToNextStep()
            }

            refreshAllTokens()
            refreshShow()
            toast.success(
                `You've got ${claimableRewards.toString()} $SHOW rewarded.`
            )

            await showTransactionSuccess()
        } catch (ex: any) {
            if (!isUserRejectedError(ex)) {
                console.log(ex)
                const msg = parseTransactionError(ex)
                toast.error(
                    `Error occurred while performing claim operation.${
                        msg ? ` (${msg})` : ''
                    }`
                )
                await showTransactionFail()
            }
        } finally {
            closeTransactionModal()
            setClaiming(false)
        }
    }, [tokens, claim, claimV1])

    return (
        <ClaimContext.Provider
            value={{
                dialogOpen,
                setDialogOpen,

                tokens,

                claiming,
                startClaiming,
            }}
        >
            {children}
            <ClaimDialog />
        </ClaimContext.Provider>
    )
}

export const useClaim = (): ClaimContext => {
    const context = useContext<ClaimContext>(ClaimContext)
    return context
}
