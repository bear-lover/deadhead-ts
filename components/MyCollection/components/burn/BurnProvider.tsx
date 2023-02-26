import axios from 'axios'
import { API_ENDPOINT, VESSEL_CONTRACT_ADDRESS } from 'config/constants'
import { Token } from 'config/types'
import React, {
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { useWeb3Connection } from 'providers/Web3ConnectionProvider'
import { useDeadHeads } from 'providers/token/DeadHeadsProvider'
import { toast } from 'react-toastify'
import { isUserRejectedError, parseTransactionError, sleep } from 'utils/helper.util'
import { useTransaction } from 'components/transaction/TransactionProvider'
import { useDeadTickets } from 'providers/token/DeadTicketsProvider'
import { useVessels } from 'providers/token/VesselsProvider'
import BurnDialog from './BurnDialog'

interface BurnContext {
    dialogOpen: boolean
    setDialogOpen: (open: boolean) => void
    step: number
    setStep: Dispatch<SetStateAction<number>>
    deadHeads: Token[]
    setDeadHeads: Dispatch<SetStateAction<Token[]>>
    deadTickets: Token[]
    setDeadTickets: Dispatch<SetStateAction<Token[]>>

    agreed: boolean
    setAgreed: (agreed: boolean) => void

    burning: boolean
    startBurning: () => void
}

const BurnContext: React.Context<BurnContext> =
    React.createContext<BurnContext>({
        dialogOpen: false,
        setDialogOpen: (open: boolean) => {},
        step: 0,
        setStep: (step: SetStateAction<number>) => {},
        deadHeads: [],
        setDeadHeads: (tokens: SetStateAction<Token[]>) => {},
        deadTickets: [],
        setDeadTickets: (tokens: SetStateAction<Token[]>) => {},

        agreed: false,
        setAgreed: (agreed: boolean) => {},

        burning: false,
        startBurning: () => {},
    })

interface BurnProvider {
    children: ReactNode
}

export function BurnProvider({ children }: BurnProvider) {
    const { connected, account } = useWeb3Connection()

    const { contract: deadHeadsContract, refreshTokens: refreshDeadHeads } =
        useDeadHeads()
    const { contract: deadTicketsContract, refreshTokens: refreshDeadTickets } =
        useDeadTickets()
    const { contract: vesselsContract, refreshTokens: refreshVessels } =
        useVessels()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [step, setStep] = useState(0)
    const [deadHeads, setDeadHeads] = useState<Token[]>([])
    const [deadTickets, setDeadTickets] = useState<Token[]>([])

    const [agreed, setAgreed] = useState(false)

    const [burning, setBurning] = useState<boolean>(false)

    const {
        openModal: openTransactionModal,
        closeModal: closeTransactionModal,
        moveToNextStep: moveTransactionToNextStep,
        showResult: showTransactionResult,
        showSuccess: showTransactionSuccess,
        showFail: showTransactionFail,
    } = useTransaction()

    const validateData = useCallback(
        async (deadHeadsTokenId, deadTicketsTokenId) => {
            if (!account) {
                throw new Error('Approval is needed.')
            }

            const response = await axios.post(
                `${API_ENDPOINT}/vessels/sign`,
                {
                    deadheadTokenId: deadHeadsTokenId,
                    ticketId: deadTicketsTokenId,
                },
                {
                    headers: {
                        address: account,
                    },
                }
            )
            return [response.data.signature, response.data.type]
        },
        [connected]
    )

    const approveDeadHead = useCallback(async () => {
        if (!account) {
            throw new Error('Approval is needed.')
        }

        if (
            !(await deadHeadsContract.isApprovedForAll(
                account,
                VESSEL_CONTRACT_ADDRESS
            ))
        ) {
            await deadHeadsContract.setApprovalForAll(
                account,
                VESSEL_CONTRACT_ADDRESS
            )
        }
    }, [connected])

    const approveTicket = useCallback(async () => {
        if (!account) {
            throw new Error('Approval is needed.')
        }

        if (
            !(await deadTicketsContract.isApprovedForAll(
                account,
                VESSEL_CONTRACT_ADDRESS
            ))
        ) {
            await deadTicketsContract.setApprovalForAll(
                account,
                VESSEL_CONTRACT_ADDRESS
            )
        }
    }, [connected])
    const burn = useCallback(
        async (
            deadHeadId: string,
            deadTicketId: string,
            tokenType: string,
            signature: string
        ) => {
            if (!account) {
                throw new Error('Approval is needed.')
            }
            return vesselsContract.evolve(
                account,
                deadHeadId,
                deadTicketId,
                tokenType,
                signature
            )
        },
        [connected]
    )

    const startBurning = useCallback(async () => {
        setBurning(true)

        setDialogOpen(false)
        await sleep(250)
        
        await openTransactionModal('Complete your burning', [
            'Validating data',
            'DeadHeads contract approved',
            'DeadTickets contract approved',
            'Burning',
        ])
        try {
            // is like this due to fact we want to be consistent with how tokens are passed
            const deadTicketId = deadTickets[0].id
            const deadHeadId = deadHeads[0].id

            const [signature, tokenType] = await validateData(
                deadHeadId,
                deadTicketId
            )
            moveTransactionToNextStep()
            await approveDeadHead()
            moveTransactionToNextStep()
            await approveTicket()
            moveTransactionToNextStep()
            await burn(deadHeadId, deadTicketId, tokenType, signature)

            refreshDeadHeads()
            refreshDeadTickets()
            refreshVessels()

            await showTransactionSuccess()
        } catch (ex: any) {
            if (!isUserRejectedError(ex)) {
                console.log(ex)
                const msg = parseTransactionError(ex)
                toast.error(
                    `Error occurred while performing burn operation.${
                        msg ? ` (${msg})` : ''
                    }`
                )
                await showTransactionFail()
            }
        } finally {
            closeTransactionModal()
            setBurning(false)
        }
    }, [
        connected,
        deadTickets,
        deadHeads,
        validateData,
        approveDeadHead,
        approveTicket,
        burn,
    ])

    useEffect(() => {
        setStep(0)
        setAgreed(false)
        setDeadTickets([])
    }, [dialogOpen])

    return (
        <BurnContext.Provider
            value={{
                dialogOpen,
                setDialogOpen,
                step,
                setStep,
                deadHeads,
                setDeadHeads,
                deadTickets,
                setDeadTickets,

                agreed,
                setAgreed,

                burning,
                startBurning,
            }}
        >
            {children}
            <BurnDialog />
        </BurnContext.Provider>
    )
}

export const useBurn = (): BurnContext => {
    return useContext<BurnContext>(BurnContext)
}
