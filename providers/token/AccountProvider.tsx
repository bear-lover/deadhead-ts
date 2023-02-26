import BigNumber from 'bignumber.js'
import {
    DEADHEADS_CONTRACT_ADDRESS,
    DEADTICKETS_CONTRACT_ADDRESS,
    GREENROOM_V2_CONTRACT_ADDRESS,
    HALOHEADS_CONTRACT_ADDRESS,
    MAIN_DATA_SOURCE,
    SEASON_ONE_CONTRACT_ADDRESS,
    SKULLTROOPERS_CONTRACT_ADDRESS,
    VESSEL_CONTRACT_ADDRESS,
} from 'config/constants'
import {
    Asset,
    TypedToken,
    TokenType,
    StakedTypedToken,
    DataSource,
} from 'config/types'
import React, {
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { getAllNonStakedAssets as getAllNonStakedAssetsFromMoralis } from 'services/api/account.api.service'
import { getAllNonStakedAssets as getAllNonStakedAssetsFromOpenSea } from 'services/opensea/account.opensea.service'
import { useWeb3Connection } from '../Web3ConnectionProvider'
import { useDeadHeads } from './DeadHeadsProvider'
import { useDeadTickets } from './DeadTicketsProvider'
import { useGreenroom } from './GreenroomProvider'
import { useGreenroomV2 } from './GreenroomV2Provider'
import { useHaloHeads } from './HaloHeadsProvider'
import { useSkullTroopers } from './SkullTroopersProvider'
import { useVessels } from './VesselsProvider'

interface AccountContext {
    tokens: TypedToken[]
    stakedTokens: StakedTypedToken[]
    claimableRewards: BigNumber
    releasableTokens: StakedTypedToken[]
    loaded: boolean
    loading: boolean
    refresh: () => void
}

const AccountContext: React.Context<AccountContext> =
    React.createContext<AccountContext>({
        tokens: [],
        stakedTokens: [],
        claimableRewards: new BigNumber(0),
        releasableTokens: [],
        loaded: false,
        loading: false,
        refresh: () => {},
    })

interface AccountProvider {
    children: ReactNode
}

export function AccountProvider({ children }: AccountProvider) {
    const [loading, setLoading] = useState<boolean>(false)
    const [loaded, setLoaded] = useState<boolean>(false)

    const { connected, account, web3 } = useWeb3Connection()

    const {
        tokens: deadHeadsTokens,
        refreshTokens: setDeadHeadsTokens,
        stakedTokens: deadHeadsStakedTokens,
        refreshStakedTokens: loadDeadHeadsStakedTokens,
    } = useDeadHeads()
    const {
        tokens: skullTroopersTokens,
        refreshTokens: setSkullTroopersTokens,
        stakedTokens: skullTroopersStakedTokens,
        refreshStakedTokens: loadSkullTroopersStakedTokens,
    } = useSkullTroopers()
    const { tokens: deadTicketsTokens, refreshTokens: setDeadTicketsTokens } =
        useDeadTickets()
    const {
        tokens: haloHeadsTokens,
        refreshTokens: setHaloHeadsTokens,
        stakedTokens: haloHeadsStakedTokens,
        refreshStakedTokens: loadHaloHeadsStakedTokens,
    } = useHaloHeads()
    const { tokens: vesselsTokens, refreshTokens: setVesselsTokens } =
        useVessels()
    const { tokens: greenroomTokens, refreshTokens: setGreenroomTokens } =
        useGreenroom()
    const { tokens: greenroomV2Tokens, refreshTokens: setGreenroomV2Tokens } =
        useGreenroomV2()

    const tokens = useMemo(
        () => [
            ...deadHeadsTokens,
            ...deadHeadsStakedTokens,
            ...skullTroopersTokens,
            ...skullTroopersStakedTokens,
            ...deadTicketsTokens,
            ...haloHeadsTokens,
            ...haloHeadsStakedTokens,
            ...vesselsTokens,
            ...greenroomTokens,
            ...greenroomV2Tokens,
        ],
        [
            deadHeadsTokens,
            deadHeadsStakedTokens,
            skullTroopersTokens,
            skullTroopersStakedTokens,
            deadTicketsTokens,
            haloHeadsTokens,
            haloHeadsStakedTokens,
            vesselsTokens,
            greenroomTokens,
            greenroomV2Tokens,
        ]
    )

    const stakedTokens = useMemo(
        () => tokens.filter((token) => token.staked) as StakedTypedToken[],
        [tokens]
    )
    const claimableRewards: BigNumber = useMemo(
        () =>
            stakedTokens.reduce(
                (rewards: BigNumber, { stakedInfo }) =>
                    rewards.plus(stakedInfo.unclaimedRewards),
                new BigNumber(0)
            ),
        [stakedTokens]
    )
    const releasableTokens: StakedTypedToken[] = useMemo(
        () =>
            stakedTokens.filter(({ stakedInfo: { releasable } }) => releasable),
        [stakedTokens]
    )

    const distributeTokens = useCallback(
        (tokenMap: Map<TokenType, TypedToken[]>) => {
            if (tokenMap.has(TokenType.DEADHEADS))
                setDeadHeadsTokens(tokenMap.get(TokenType.DEADHEADS))

            if (tokenMap.has(TokenType.SKULLTROOPERS))
                setSkullTroopersTokens(tokenMap.get(TokenType.SKULLTROOPERS))

            if (tokenMap.has(TokenType.DEADTICKETS))
                setDeadTicketsTokens(tokenMap.get(TokenType.DEADTICKETS))

            if (tokenMap.has(TokenType.HALOHEADS))
                setHaloHeadsTokens(tokenMap.get(TokenType.HALOHEADS))

            if (tokenMap.has(TokenType.VESSELS))
                setVesselsTokens(tokenMap.get(TokenType.VESSELS))

            if (tokenMap.has(TokenType.GREENROOM))
                setGreenroomTokens(tokenMap.get(TokenType.GREENROOM))

            if (tokenMap.has(TokenType.GREENROOM_V2))
                setGreenroomV2Tokens(tokenMap.get(TokenType.GREENROOM_V2))
        },
        []
    )

    const loadAllNonStakedTokensFromMoralis = useCallback(async () => {
        if (!account) return

        try {
            const assets: Asset[] = await getAllNonStakedAssetsFromMoralis(
                account
            )

            const tokenMap = new Map<TokenType, TypedToken[]>()

            assets.forEach(({ contractAddress, ...tokenData }) => {
                const type = CONTRACT_ADDRESS_TO_TOKEN_TYPE_MAP.get(
                    contractAddress.toLocaleLowerCase()
                )
                if (type == null) return

                let tokens = tokenMap.get(type)
                if (!tokens) {
                    tokens = []
                    tokenMap.set(type, tokens)
                }
                tokens.push({ ...tokenData, type })
            })

            distributeTokens(tokenMap)
        } catch (ex) {
            console.log(ex)
        }
    }, [connected])

    const loadAllNonStakedTokensFromOpenSea = useCallback(async () => {
        if (!account) return

        try {
            const assets: Asset[] = await getAllNonStakedAssetsFromOpenSea(
                account
            )

            const tokenMap = new Map<TokenType, TypedToken[]>()

            assets.forEach(({ contractAddress, ...tokenData }) => {
                const type = CONTRACT_ADDRESS_TO_TOKEN_TYPE_MAP.get(
                    contractAddress.toLocaleLowerCase()
                )
                if (type == null) return

                let tokens = tokenMap.get(type)
                if (!tokens) {
                    tokens = []
                    tokenMap.set(type, tokens)
                }
                tokens.push({ ...tokenData, type })
            })

            distributeTokens(tokenMap)
        } catch (ex) {
            console.log(ex)
        }
    }, [connected])

    const loadAllNonStakedTokens = useCallback(() => {
        switch (MAIN_DATA_SOURCE.toString()) {
            case DataSource.MORALIS:
                return Promise.all([
                    loadAllNonStakedTokensFromMoralis(),
                    setGreenroomTokens(),
                    setGreenroomV2Tokens(),
                ])
            case DataSource.OPENSEA:
                return loadAllNonStakedTokensFromOpenSea()
            case DataSource.ONCHAIN:
                return Promise.all([
                    setDeadHeadsTokens(),
                    setSkullTroopersTokens(),
                    setDeadTicketsTokens(),
                    setHaloHeadsTokens(),
                    setVesselsTokens(),
                    setGreenroomTokens(),
                    setGreenroomV2Tokens(),
                ])
        }
    }, [connected])

    const loadAllStakedTokens = useCallback(() => {
        return Promise.all([
            loadDeadHeadsStakedTokens(),
            loadSkullTroopersStakedTokens(),
            loadHaloHeadsStakedTokens(),
        ])
    }, [
        loadDeadHeadsStakedTokens,
        loadSkullTroopersStakedTokens,
        loadHaloHeadsStakedTokens,
    ])

    const loadAllTokens = useCallback(async () => {
        if (!connected) return

        setLoading(true)
        try {
            await Promise.all([loadAllNonStakedTokens(), loadAllStakedTokens()])
            setLoaded(true)
        } catch (ex) {
            console.log(ex)
        } finally {
            setLoading(false)
        }
    }, [connected])

    useEffect(() => {
        loadAllTokens()
    }, [loadAllTokens])

    return (
        <AccountContext.Provider
            value={{
                tokens,
                stakedTokens,
                claimableRewards,
                releasableTokens,
                loaded,
                loading,
                refresh: loadAllTokens,
            }}
        >
            {children}
        </AccountContext.Provider>
    )
}

export const useAccount = (): AccountContext => {
    const context = useContext<AccountContext>(AccountContext)
    return context
}

const CONTRACT_ADDRESS_TO_TOKEN_TYPE_MAP: Map<string, TokenType> =
    (function () {
        const map = new Map<string, TokenType>()
        const addresses: [TokenType, string][] = [
            [TokenType.DEADHEADS, DEADHEADS_CONTRACT_ADDRESS],
            [TokenType.SKULLTROOPERS, SKULLTROOPERS_CONTRACT_ADDRESS],
            [TokenType.HALOHEADS, HALOHEADS_CONTRACT_ADDRESS],
            [TokenType.DEADTICKETS, DEADTICKETS_CONTRACT_ADDRESS],
            [TokenType.VESSELS, VESSEL_CONTRACT_ADDRESS],
            [TokenType.GREENROOM, SEASON_ONE_CONTRACT_ADDRESS],
            [TokenType.GREENROOM_V2, GREENROOM_V2_CONTRACT_ADDRESS],
        ]
        addresses.forEach(([tokenType, contractAddress]) => {
            map.set(contractAddress.toLocaleLowerCase(), tokenType)
        })
        return map
    })()
