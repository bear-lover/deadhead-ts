import { TransactionResult } from 'config/types'
import React, {
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useState,
} from 'react'
import { sleep } from 'utils/helper.util'
import TransactionModal from './TransactionModal'
import TransactionResultModal from './TransactionResultModal'

interface TransactionContext {
    modalTitle: string
    setModalTitle: (title: string) => void
    modalOpen: boolean
    setModalOpen: (open: boolean) => void

    steps: string[]
    setSteps: (steps: string[]) => void
    currentStepNo: number
    setCurrentStepNo: Dispatch<SetStateAction<number>>

    openModal: (title: string, steps: string[]) => Promise<void>
    closeModal: () => void
    moveToNextStep: () => void

    result?: TransactionResult
    setResult: (result: TransactionResult) => void
    resultModalOpen: boolean
    setResultModalOpen: (open: boolean) => void

    showResult: (result: TransactionResult) => Promise<void>
    showSuccess: () => Promise<void>
    showFail: () => Promise<void>
}

const TransactionContext: React.Context<TransactionContext> =
    React.createContext<TransactionContext>({
        modalTitle: '',
        setModalTitle: (title: string) => {},
        modalOpen: false,
        setModalOpen: (open: boolean) => {},

        steps: [],
        setSteps: (steps: string[]) => {},
        currentStepNo: 0,
        setCurrentStepNo: (step: SetStateAction<number>) => {},

        openModal: (title: string, steps: string[]) => Promise.resolve(),
        closeModal: () => {},
        moveToNextStep: () => {},

        result: undefined,
        setResult: (result: TransactionResult) => {},
        resultModalOpen: false,
        setResultModalOpen: (open: boolean) => {},

        showResult: (result: TransactionResult) => Promise.resolve(),
        showSuccess: () => Promise.resolve(),
        showFail: () => Promise.resolve(),
    })

interface TransactionProvider {
    children: ReactNode
}

export function TransactionProvider({ children }: TransactionProvider) {
    const [modalTitle, setModalTitle] = useState('')
    const [modalOpen, setModalOpen] = useState(false)

    const [steps, setSteps] = useState<string[]>([])
    const [currentStepNo, setCurrentStepNo] = useState<number>(0)

    const [result, setResult] = useState<TransactionResult>()
    const [resultModalOpen, setResultModalOpen] = useState(false)

    const openModal = useCallback(async (title: string, steps: string[]) => {
        setModalTitle(title)
        setSteps(steps)
        setCurrentStepNo(0)

        setModalOpen(true)
        await sleep(350)
    }, [])

    const closeModal = useCallback(() => {
        setModalOpen(false)
    }, [])

    const moveToNextStep = useCallback(() => {
        setCurrentStepNo((step) => step + 1)
    }, [])

    const showResult = useCallback(async (result: TransactionResult) => {
        setModalOpen(false)
        await sleep(250)

        setResult(result)
        setResultModalOpen(true)
        await sleep(350)
    }, [])

    const showSuccess = useCallback(async () => {
        return showResult(TransactionResult.SUCCESS)
    }, [])

    const showFail = useCallback(async () => {
        return showResult(TransactionResult.FAIL)
    }, [])

    return (
        <TransactionContext.Provider
            value={{
                modalTitle,
                setModalTitle,
                modalOpen,
                setModalOpen,

                steps,
                setSteps,
                currentStepNo,
                setCurrentStepNo,

                openModal,
                closeModal,
                moveToNextStep,

                result,
                setResult,
                resultModalOpen,
                setResultModalOpen,

                showResult,
                showSuccess,
                showFail,
            }}
        >
            {children}
            <TransactionModal />
            <TransactionResultModal />
        </TransactionContext.Provider>
    )
}

export const useTransaction = (): TransactionContext => {
    const context = useContext<TransactionContext>(TransactionContext)
    return context
}
