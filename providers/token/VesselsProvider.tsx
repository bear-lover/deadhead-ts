import React, {
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
import { DataSource, TypedToken } from 'config/types'
import { useWeb3Connection } from '../Web3ConnectionProvider'
import { getOwnerAssets as getOwnerAssetsFromMoralis } from 'services/api/vessels.api.service'
import { getOwnerAssets as getOwnerAssetsFromOpenSea } from 'services/opensea/vessels.opensea.service'
import VesselsContractService from 'services/contract/vessels.contract.service'
import { MAIN_DATA_SOURCE } from 'config/constants'

interface VesselsContext {
    tokens: TypedToken[]
    tokensLoading: boolean
    refreshTokens: (tokens?: TypedToken[]) => void

    contract: any
}

const VesselsContext: React.Context<VesselsContext> =
    React.createContext<VesselsContext>({
        tokens: [],
        tokensLoading: false,
        refreshTokens: (tokens?: TypedToken[]) => {},

        contract: undefined,
    })

interface VesselsProvider {
    children: ReactNode
}

export function VesselsProvider({ children }: VesselsProvider) {
    const [tokens, _setTokens] = useState<TypedToken[]>([])
    const [tokensLoading, setTokensLoading] = useState<boolean>(false)

    const { connected, account, web3 } = useWeb3Connection()
    const contract = useMemo(
        () => (web3 ? new VesselsContractService(web3) : undefined),
        [web3]
    )

    const setTokens = useCallback(
        (tokens) => {
            _setTokens(
                tokens.map(({ video, image, ...token }) => ({
                    ...token,
                    image: video && image,
                    video: video || image,
                }))
            )
        },
        [_setTokens]
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
                const tokens = await getTokensByAccount()
                setTokens(tokens)
            } catch (ex) {
                console.log(ex)
            } finally {
                setTokensLoading(false)
            }
        },
        [connected]
    )

    return (
        <VesselsContext.Provider
            value={{
                tokens,
                tokensLoading,
                refreshTokens: loadTokens,

                contract,
            }}
        >
            {children}
        </VesselsContext.Provider>
    )
}

export const useVessels = (): VesselsContext => {
    const context = useContext<VesselsContext>(VesselsContext)
    return context
}
