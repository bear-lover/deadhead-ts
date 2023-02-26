import React, {
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
import { DataSource, TypedToken } from 'config/types'
import { useWeb3Connection } from '../Web3ConnectionProvider'
import { getOwnerAssets as getOwnerAssetsFromMoralis } from 'services/api/greenroom.api.service'
import { getOwnerAssets as getOwnerAssetsFromOpenSea } from 'services/opensea/greenroom.opensea.service'
import { MAIN_DATA_SOURCE } from 'config/constants'
import GreenroomContractService from 'services/contract/greenroom.contract.service'

interface GreenroomContext {
    tokens: TypedToken[]
    tokensLoading: boolean
    refreshTokens: (tokens?: TypedToken[]) => void
}

const GreenroomContext: React.Context<GreenroomContext> =
    React.createContext<GreenroomContext>({
        tokens: [],
        tokensLoading: false,
        refreshTokens: (tokens?: TypedToken[]) => {},
    })

interface GreenroomProvider {
    children: ReactNode
}

export function GreenroomProvider({ children }: GreenroomProvider) {
    const [tokens, setTokens] = useState<TypedToken[]>([])
    const [tokensLoading, setTokensLoading] = useState<boolean>(false)

    const { connected, account, web3 } = useWeb3Connection()
    const contract = useMemo(
        () => (web3 ? new GreenroomContractService(web3) : undefined),
        [web3]
    )

    const getTokensByAccount = useCallback(() => {
        if (!account || !contract) return []

        switch (MAIN_DATA_SOURCE.toString()) {
            case DataSource.MORALIS:
                return contract.getTokensByAccount(account)
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
        <GreenroomContext.Provider
            value={{
                tokens,
                tokensLoading,
                refreshTokens: loadTokens,
            }}
        >
            {children}
        </GreenroomContext.Provider>
    )
}

export const useGreenroom = (): GreenroomContext => {
    const context = useContext<GreenroomContext>(GreenroomContext)
    return context
}
