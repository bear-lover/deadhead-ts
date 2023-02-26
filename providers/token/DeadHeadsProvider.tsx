import React, {
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
import {
    DataSource,
    StakedTypedToken,
    StakeVersion,
    Token,
    TokenType,
    TypedToken,
} from 'config/types'
import { useWeb3Connection } from '../Web3ConnectionProvider'
import { getOwnerAssets as getOwnerAssetsFromMoralis } from 'services/api/deadheads.api.service'
import { getOwnerAssets as getOwnerAssetsFromOpenSea } from 'services/opensea/deadheads.opensea.service'
import DeadHeadsContractService from 'services/contract/deadheads.contract.service'
import StakeV1ContractService from 'services/contract/stake-v1.contract.service'
import StakeV2ContractService from 'services/contract/stake-v2.conract.service'
import {
    DEADHEADS_CONTRACT_ADDRESS,
    MAIN_DATA_SOURCE,
    OPENSEA_ASSET_URL,
} from 'config/constants'
import { usePrivateIPFSGateway } from 'utils/helper.util'
import axios from 'axios'
import BigNumber from 'bignumber.js'

interface DeadHeadsContext {
    tokens: TypedToken[]
    tokensLoading: boolean
    refreshTokens: (tokens?: TypedToken[]) => void

    stakedTokens: TypedToken[]
    stakedTokensLoading: boolean
    refreshStakedTokens: (version?: StakeVersion) => void

    contract: any
    stakeContract: any
    stakeV1Contract: any
}

const DeadHeadsContext: React.Context<DeadHeadsContext> =
    React.createContext<DeadHeadsContext>({
        tokens: [],
        tokensLoading: false,
        refreshTokens: (tokens?: TypedToken[]) => {},

        stakedTokens: [],
        stakedTokensLoading: false,
        refreshStakedTokens: (version?: StakeVersion) => {},

        contract: undefined,
        stakeContract: undefined,
        stakeV1Contract: undefined,
    })

interface DeadHeadsProvider {
    children: ReactNode
}

export function DeadHeadsProvider({ children }: DeadHeadsProvider) {
    const [tokens, setTokens] = useState<TypedToken[]>([])
    const [tokensLoading, setTokensLoading] = useState<boolean>(false)

    const [stakedTokensV1, setStakedTokensV1] = useState<TypedToken[]>([])
    const [stakedTokensLoadingV1, setStakedTokensLoadingV1] =
        useState<boolean>(false)

    const [stakedTokensV2, setStakedTokensV2] = useState<TypedToken[]>([])
    const [stakedTokensLoadingV2, setStakedTokensLoadingV2] =
        useState<boolean>(false)

    const stakedTokens = useMemo(
        () => [...stakedTokensV1, ...stakedTokensV2],
        [stakedTokensV1, stakedTokensV2]
    )
    const stakedTokensLoading = useMemo(
        () => stakedTokensLoadingV1 || stakedTokensLoadingV2,
        [stakedTokensLoadingV1, stakedTokensLoadingV2]
    )

    const { connected, account, web3 } = useWeb3Connection()
    const contract = useMemo(
        () => (web3 ? new DeadHeadsContractService(web3) : undefined),
        [web3]
    )
    const stakeV1Contract = useMemo(
        () =>
            web3
                ? new StakeV1ContractService(web3, DEADHEADS_CONTRACT_ADDRESS)
                : undefined,
        [web3]
    )
    const stakeV2Contract = useMemo(
        () =>
            web3
                ? new StakeV2ContractService(web3, DEADHEADS_CONTRACT_ADDRESS)
                : undefined,
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

            if (!connected) {
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

    const __loadStakedTokens: (
        stakeContract: StakeV1ContractService | StakeV2ContractService
    ) => Promise<StakedTypedToken[]> = useCallback(
        async (stakeContract) => {
            const stakedTokenIds: string[] =
                await stakeContract.getStakedTokenIds(account!)

            const now = Math.floor(Date.now() / 1000)
            return Promise.all(
                stakedTokenIds.map((stakedTokenId) =>
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
                                name: `DeadHeads ${tokenId}`,
                                image: usePrivateIPFSGateway(metadata.image),
                                url: `${OPENSEA_ASSET_URL}/${DEADHEADS_CONTRACT_ADDRESS}/${tokenId}`,
                                type: TokenType.STAKED_DEADHEADS,
                                staked: true,
                                stakedInfo: {
                                    id: stakedTokenId,
                                    stakedAt: parseInt(stakedToken.stakedAt),
                                    endsAt: endsAt,
                                    months: parseInt(stakedToken.months),
                                    monthlyRewards: parseInt(
                                        web3!.utils.fromWei(
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
        },
        [connected]
    )

    const loadStakedTokensV1 = useCallback(async () => {
        if (!web3 || !account || !contract || !stakeV1Contract) {
            setStakedTokensV1([])
            return
        }

        setStakedTokensLoadingV1(true)
        try {
            const tokens = await __loadStakedTokens(stakeV1Contract)
            tokens.forEach(
                (token) => (token.stakedInfo!.version = StakeVersion.VERSION_1)
            )
            setStakedTokensV1(tokens)
        } catch (ex) {
            console.log(ex)
        } finally {
            setStakedTokensLoadingV1(false)
        }
    }, [connected])

    const loadStakedTokensV2 = useCallback(async () => {
        if (!web3 || !account || !contract || !stakeV2Contract) {
            setStakedTokensV2([])
            return
        }

        setStakedTokensLoadingV2(true)
        try {
            const tokens = await __loadStakedTokens(stakeV2Contract)
            tokens.forEach(
                (token) => (token.stakedInfo!.version = StakeVersion.VERSION_2)
            )

            setStakedTokensV2(tokens)
        } catch (ex) {
            console.log(ex)
        } finally {
            setStakedTokensLoadingV2(false)
        }
    }, [connected])

    const loadStakedTokens = useCallback(
        async (version?: StakeVersion) => {
            if (version === StakeVersion.VERSION_1) {
                return loadStakedTokensV1()
            } else if (version === StakeVersion.VERSION_2) {
                return loadStakedTokensV2()
            } else {
                return Promise.all([loadStakedTokensV1(), loadStakedTokensV2()])
            }
        },
        [connected]
    )

    return (
        <DeadHeadsContext.Provider
            value={{
                tokens,
                tokensLoading,
                refreshTokens: loadTokens,

                stakedTokens,
                stakedTokensLoading,
                refreshStakedTokens: loadStakedTokens,

                contract,
                stakeContract: stakeV2Contract,
                stakeV1Contract,
            }}
        >
            {children}
        </DeadHeadsContext.Provider>
    )
}

export const useDeadHeads = (): DeadHeadsContext => {
    const context = useContext<DeadHeadsContext>(DeadHeadsContext)
    return context
}
