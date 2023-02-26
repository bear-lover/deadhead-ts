import BigNumber from 'bignumber.js'
import React, {
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import ShowBizContractService from 'services/contract/showbiz.contract.service'
import { useWeb3Connection } from '../Web3ConnectionProvider'

interface ShowBizContext {
    balance: BigNumber
    loading: boolean
    refresh: () => void

    contract?: ShowBizContractService
}

const ShowBizContext: React.Context<ShowBizContext> =
    React.createContext<ShowBizContext>({
        balance: new BigNumber(0),
        loading: false,
        refresh: () => {},

        contract: undefined,
    })

interface ShowBizProvider {
    children: ReactNode
}

export function ShowBizProvider({ children }: ShowBizProvider) {
    const [balance, setBalance] = useState<BigNumber>(new BigNumber(0))
    const [loading, setLoading] = useState<boolean>(false)

    const { web3, account } = useWeb3Connection()
    const contract = useMemo(
        () => (web3 ? new ShowBizContractService(web3) : undefined),
        [web3]
    )

    const loadBalance = useCallback(async () => {
        if (!web3 || !contract) {
            setBalance(new BigNumber(0))
            return
        }

        setLoading(true)
        try {
            const balance = await contract.balanceOf(account!)
            setBalance(new BigNumber(web3.utils.fromWei(balance, 'ether')))
        } catch (ex) {
            console.log(ex)
        } finally {
            setLoading(false)
        }
    }, [web3, contract])

    useEffect(() => {
        loadBalance()
    }, [loadBalance])

    return (
        <ShowBizContext.Provider
            value={{
                balance,
                loading,
                refresh: loadBalance,

                contract,
            }}
        >
            {children}
        </ShowBizContext.Provider>
    )
}

export const useShowBiz = (): ShowBizContext => {
    const context = useContext<ShowBizContext>(ShowBizContext)
    return context
}
