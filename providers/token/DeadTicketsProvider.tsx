import React, {
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
import { DataSource, TokenType, TypedToken } from 'config/types'
import { useWeb3Connection } from '../Web3ConnectionProvider'
import { getOwnerAssets as getOwnerAssetsFromMoralis } from 'services/api/deadtickets.api.service'
import { getOwnerAssets as getOwnerAssetsFromOpenSea } from 'services/opensea/deadtickets.opensea.service'
import DeadTicketsContractService from 'services/contract/deadtickets.contract.service'
import { MAIN_DATA_SOURCE } from 'config/constants'

interface DeadTicketsContext {
    tokens: TypedToken[]
    tokensLoading: boolean
    refreshTokens: (tokens?: TypedToken[]) => void

    contract: any
}

const DeadTicketsContext: React.Context<DeadTicketsContext> =
    React.createContext<DeadTicketsContext>({
        tokens: [],
        tokensLoading: false,
        refreshTokens: (tokens?: TypedToken[]) => {},

        contract: undefined,
    })

interface DeadTicketsProvider {
    children: ReactNode
}

export function DeadTicketsProvider({ children }: DeadTicketsProvider) {
    const [tokens, setTokens] = useState<TypedToken[]>([])
    const [tokensLoading, setTokensLoading] = useState<boolean>(false)

    const { connected, account, web3 } = useWeb3Connection()
    const contract = useMemo(
        () => (web3 ? new DeadTicketsContractService(web3) : undefined),
        [web3]
    )

    const getTokensByAccount = useCallback(() => {
        if (!account || !contract) return []

        switch (MAIN_DATA_SOURCE.toString()) {
            case DataSource.MORALIS:
                return getOwnerAssetsFromMoralis(account)
            case DataSource.OPENSEA:
                return getOwnerAssetsFromOpenSea(account)
            case DataSource.ONCHAIN:
            default:
                return contract.getTokensByAccount(account)
        }
    }, [connected])

    const loadTokens = useCallback(
        async (tokens?: TypedToken[]) => {
            if (tokens) {
                setTokens(tokens)
                return
            }

            if (!connected || !account) {
                return
            }

            setTokensLoading(true)
            try {
                setTokens(await getTokensByAccount())
            } catch (ex) {
                console.log(ex)
            } finally {
                setTokensLoading(false)
            }
        },
        [connected]
    )

    return (
        <DeadTicketsContext.Provider
            value={{
                tokens,
                tokensLoading,
                refreshTokens: loadTokens,

                contract,
            }}
        >
            {children}
        </DeadTicketsContext.Provider>
    )
}

export const useDeadTickets = (): DeadTicketsContext => {
    const context = useContext<DeadTicketsContext>(DeadTicketsContext)
    return context
}
