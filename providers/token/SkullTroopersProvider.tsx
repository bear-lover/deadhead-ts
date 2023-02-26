import React, {
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
import { DataSource, TokenType, TypedToken } from 'config/types'
import { useWeb3Connection } from '../Web3ConnectionProvider'
import { getOwnerAssets as getOwnerAssetsFromMoralis } from 'services/api/skulltroopers.api.service'
import { getOwnerAssets as getOwnerAssetsFromOpenSea } from 'services/opensea/skulltroopers.opensea.service'
import { usePrivateIPFSGateway } from 'utils/helper.util'
import axios from 'axios'
import {
    MAIN_DATA_SOURCE,
    OPENSEA_ASSET_URL,
    SKULLTROOPERS_CONTRACT_ADDRESS,
} from 'config/constants'
import StakeV2ContractService from 'services/contract/stake-v2.conract.service'
import SkullTroopersContractService from 'services/contract/skulltroopers.contract.service'
import BigNumber from 'bignumber.js'

interface SkullTroopersContext {
    tokens: TypedToken[]
    tokensLoading: boolean
    refreshTokens: (tokens?: TypedToken[]) => void

    stakedTokens: TypedToken[]
    stakedTokensLoading: boolean
    refreshStakedTokens: () => void

    contract: any
    stakeContract: any
}

const SkullTroopersContext: React.Context<SkullTroopersContext> =
    React.createContext<SkullTroopersContext>({
        tokens: [],
        tokensLoading: false,
        refreshTokens: (tokens?: TypedToken[]) => {},

        stakedTokens: [],
        stakedTokensLoading: false,
        refreshStakedTokens: () => {},

        contract: undefined,
        stakeContract: undefined,
    })

interface SkullTroopersProvider {
    children: ReactNode
}

export function SkullTroopersProvider({ children }: SkullTroopersProvider) {
    const [tokens, setTokens] = useState<TypedToken[]>([])
    const [tokensLoading, setTokensLoading] = useState<boolean>(false)

    const { connected, web3, account } = useWeb3Connection()
    const contract = useMemo(
        () => (web3 ? new SkullTroopersContractService(web3) : undefined),
        [web3]
    )
    const stakeContract = useMemo(
        () =>
            web3
                ? new StakeV2ContractService(
                      web3,
                      SKULLTROOPERS_CONTRACT_ADDRESS
                  )
                : undefined,
        [web3]
    )
    const [stakedTokens, setStakedTokens] = useState<TypedToken[]>([])
    const [stakedTokensLoading, setStakedTokensLoading] =
        useState<boolean>(false)

    const getTokensByAccount = useCallback(() => {
        if (!account || !contract) return []

        switch (MAIN_DATA_SOURCE.toString()) {
            case DataSource.MORALIS:
                return getOwnerAssetsFromMoralis(account)
            case DataSource.OPENSEA:
                return getOwnerAssetsFromOpenSea(account)
            case DataSource.ONCHAIN:
            default:
                // return contract.getTokensByAccount(account) // Not Supported
                return getOwnerAssetsFromMoralis(account)
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

    const loadStakedTokens = useCallback(async () => {
        if (!web3 || !account || !contract || !stakeContract) {
            setStakedTokens([])
            return
        }

        setStakedTokensLoading(true)
        try {
            const tokenIds: string[] = await stakeContract.getStakedTokenIds(
                account
            )

            const now = Math.floor(Date.now() / 1000)
            const tokens = await Promise.all(
                tokenIds.map((stakedTokenId) =>
                    stakeContract
                        .getStakedToken(stakedTokenId)
                        .then(async (stakedToken: any) => {
                            const tokenId = stakedToken.tokenId
                            const [metadata, unclaimedRewards] =
                                await Promise.all([
                                    contract!
                                        .getTokenURI(tokenId)
                                        .then((uri: string) =>
                                            axios
                                                .get(usePrivateIPFSGateway(uri))
                                                .then(
                                                    (response) => response.data
                                                )
                                        ),
                                    stakeContract.unclaimedRewards(
                                        stakedTokenId
                                    ),
                                ])

                            let endsAt: number = parseInt(stakedToken.endsAt)
                            return {
                                id: tokenId,
                                name: `SKULLTROOPERS ${tokenId}`,
                                image: usePrivateIPFSGateway(metadata.image),
                                url: `${OPENSEA_ASSET_URL}/${SKULLTROOPERS_CONTRACT_ADDRESS}/${tokenId}`,
                                type: TokenType.STAKED_SKULLTROOPERS,
                                staked: true,
                                stakedInfo: {
                                    stakedAt: parseInt(stakedToken.stakedAt),
                                    endsAt: endsAt,
                                    months: parseInt(stakedToken.months),
                                    monthlyRewards: parseInt(
                                        web3.utils.fromWei(
                                            stakedToken.monthlyRewards,
                                            'ether'
                                        )
                                    ),
                                    unclaimedRewards: new BigNumber(
                                        web3!.utils.fromWei(
                                            unclaimedRewards,
                                            'ether'
                                        )
                                    ),
                                    releasable: endsAt < now,
                                },
                            }
                        })
                )
            )
            setStakedTokens(tokens)
        } catch (ex) {
            console.log(ex)
        } finally {
            setStakedTokensLoading(false)
        }
    }, [connected])

    return (
        <SkullTroopersContext.Provider
            value={{
                tokens,
                tokensLoading,
                refreshTokens: loadTokens,

                stakedTokens,
                stakedTokensLoading,
                refreshStakedTokens: loadStakedTokens,

                contract,
                stakeContract,
            }}
        >
            {children}
        </SkullTroopersContext.Provider>
    )
}

export const useSkullTroopers = (): SkullTroopersContext => {
    const context = useContext<SkullTroopersContext>(SkullTroopersContext)
    return context
}
