import { TokenType, Token } from 'config/types'
import React, {
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useState,
} from 'react'
import { toast } from 'react-toastify'
import { isUserRejectedError, parseTransactionError, sleep } from 'utils/helper.util'
import { useWeb3Connection } from 'providers/Web3ConnectionProvider'
import { useHaloHeads } from 'providers/token/HaloHeadsProvider'
import { useTransaction } from 'components/transaction/TransactionProvider'
import EvolveDialog from './EvolveDialog'
import { useVessels } from 'providers/token/VesselsProvider'

interface EvolveContext {
    dialogOpen: boolean
    setDialogOpen: (open: boolean) => void
    vessels: Token[]
    setVessels: Dispatch<SetStateAction<Token[]>>

    evolving: boolean
    startEvolving: () => void
}

const EvolveContext: React.Context<EvolveContext> =
    React.createContext<EvolveContext>({
        dialogOpen: false,
        setDialogOpen: (open: boolean) => {},
        vessels: [],
        setVessels: (vessels: SetStateAction<Token[]>) => {},

        evolving: false,
        startEvolving: () => {},
    })

interface EvolveProvider {
    children: ReactNode
}

export function EvolveProvider({ children }: EvolveProvider) {
    const { connected, account } = useWeb3Connection()

    const { contract: vesselsContract, refreshTokens: refreshVessels } =
        useVessels()
    const { contract: haloHeadsConract, refreshTokens: refreshHaloHeads } =
        useHaloHeads()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [vessels, setVessels] = useState<Token[]>([])

    const [evolving, setEvolving] = useState<boolean>(false)
    const {
        openModal: openTransactionModal,
        closeModal: closeTransactionModal,
        moveToNextStep: moveTransactionToNextStep,
        showResult: showTransactionResult,
        showSuccess: showTransactionSuccess,
        showFail: showTransactionFail,
    } = useTransaction()

    const approveForEvolving = useCallback(async () => {
        if (!account || !vesselsContract) throw new Error('Approval is needed.')

        let approved = await vesselsContract.isApprovedForAll(
            account,
            haloHeadsConract.contractAddress
        )

        !approved &&
            (await vesselsContract.setApprovalForAll(
                account,
                haloHeadsConract.contractAddress
            ))
    }, [connected])

    const evolve = useCallback(
        async (vessels: Token[]) => {
            if (!account) return

            return haloHeadsConract.batchEvolve(
                account,
                vessels.map(({ id }) => id)
            )
        },
        [connected]
    )

    const startEvolving = useCallback(async () => {
        setEvolving(true)

        setDialogOpen(false)
        await sleep(250)
        
        await openTransactionModal('Complete your evolving', [
            'Contract approved',
            'Transaction pending',
        ])

        try {
            await approveForEvolving()

            moveTransactionToNextStep()

            await evolve(vessels)

            moveTransactionToNextStep()

            refreshVessels()
            refreshHaloHeads()
            // toast.success('Evolving succcess!!!')

            await showTransactionSuccess()
        } catch (ex: any) {
            if (!isUserRejectedError(ex)) {
                console.log(ex)
                const msg = parseTransactionError(ex)
                toast.error(
                    `Error occurred while performing evolve operation.${
                        msg ? ` (${msg})` : ''
                    }`
                )
                await showTransactionFail()
            }
        } finally {
            closeTransactionModal()
            setEvolving(false)
        }
    }, [connected, vessels, approveForEvolving, evolve])

    return (
        <EvolveContext.Provider
            value={{
                dialogOpen,
                setDialogOpen,
                vessels,
                setVessels,

                evolving,
                startEvolving,
            }}
        >
            {children}
            <EvolveDialog />
        </EvolveContext.Provider>
    )
}

export const useEvolve = (): EvolveContext => {
    const context = useContext<EvolveContext>(EvolveContext)
    return context
}
