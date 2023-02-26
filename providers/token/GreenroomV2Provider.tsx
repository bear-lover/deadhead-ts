import React, {
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import {
    DataSource,
    GreenroomV2Item,
    GreenroomV2PurchaseType,
    TypedToken,
} from 'config/types'
import { useWeb3Connection } from '../Web3ConnectionProvider'
import { getOwnerAssets as getOwnerAssetsFromOpenSea } from 'services/opensea/greenroom-v2.opensea.service'
import {
    GREENROOM_V2_CONTRACT_ADDRESS,
    MAIN_DATA_SOURCE,
    MAX_ALLOWANCE,
} from 'config/constants'
import GreenroomV2ContractService from 'services/contract/greenroom-v2.contract.service'
import { useTransaction } from 'components/transaction/TransactionProvider'
import { isUserRejectedError, parseTransactionError } from 'utils/helper.util'
import { toast } from 'react-toastify'
import { getSignature } from 'services/api/greenroom-v2.api.service'
import { useShowBiz } from './ShowBizProvider'
import BigNumber from 'bignumber.js'

interface GreenroomV2Context {
    mintableItems: GreenroomV2Item[]
    mintableItemsLoading: boolean
    mintableItemsLoaded: boolean
    refreshMintableItems: (items?: GreenroomV2Item[]) => void

    tokens: TypedToken[]
    tokensLoading: boolean
    refreshTokens: (tokens?: TypedToken[]) => void

    minting: boolean
    mintingId?: string
    startMinting: (item: GreenroomV2Item, quantity: number) => void
}

const GreenroomV2Context: React.Context<GreenroomV2Context> =
    React.createContext<GreenroomV2Context>({
        mintableItems: [],
        mintableItemsLoading: false,
        mintableItemsLoaded: false,
        refreshMintableItems: (items?: GreenroomV2Item[]) => {},

        tokens: [],
        tokensLoading: false,
        refreshTokens: (tokens?: TypedToken[]) => {},

        minting: false,
        mintingId: undefined,
        startMinting: (item: GreenroomV2Item, quantity: number) => {},
    })

interface GreenroomV2Provider {
    children: ReactNode
}

export function GreenroomV2Provider({ children }: GreenroomV2Provider) {
    const [mintableItems, setMintableItems] = useState<GreenroomV2Item[]>([])
    const [mintableItemsLoading, setMintableItemsLoading] =
        useState<boolean>(false)
    const [mintableItemsLoaded, setMintableItemsLoaded] =
        useState<boolean>(false)

    const [tokens, setTokens] = useState<TypedToken[]>([])
    const [tokensLoading, setTokensLoading] = useState<boolean>(false)

    const { connected, account, web3 } = useWeb3Connection()
    const contract = useMemo(
        () => (web3 ? new GreenroomV2ContractService(web3) : undefined),
        [web3]
    )

    const { balance: showBizBalance } = useShowBiz()

    const loadMintableItems = useCallback(async () => {
        if (!connected || !contract) {
            return
        }

        setMintableItemsLoading(true)
        try {
            setMintableItems(await contract.mintableItems())
            setMintableItemsLoaded(true)
        } catch (ex) {
            console.log(ex)
        } finally {
            setMintableItemsLoading(false)
        }
    }, [connected])

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

    const [minting, setMinting] = useState<boolean>(false)
    const [mintingId, setMintingId] = useState<string>()
    const { contract: showBizContract } = useShowBiz()
    const {
        openModal: openTransactionModal,
        closeModal: closeTransactionModal,
        moveToNextStep: moveTransactionToNextStep,
        showResult: showTransactionResult,
        showSuccess: showTransactionSuccess,
        showFail: showTransactionFail,
    } = useTransaction()

    const mint = useCallback(
        async (item: GreenroomV2Item, quantity: number) => {
            if (!account || !contract) return

            if (!item.totalSupply) {
                const signature: string = await getSignature(account, item.id)
                return contract.createItem(account, item, quantity, signature)
            } else {
                return contract.mint(account, item, quantity)
            }
        },
        [connected]
    )

    const startMinting = useCallback(
        async (item: GreenroomV2Item, quantity: number) => {
            if (!account || !showBizContract || !web3) return

            setMinting(true)
            setMintingId(item.id)

            const steps = ['Transaction pending']
            if (item.purchaseType == GreenroomV2PurchaseType.SHOW)
                steps.unshift('Approval pending')

            await openTransactionModal('Complete your minting', steps)

            try {
                if (item.purchaseType == GreenroomV2PurchaseType.SHOW) {
                    if (
                        showBizBalance.lt(
                            new BigNumber(
                                web3.utils.fromWei(item.price, 'ether')
                            ).times(quantity)
                        )
                    ) {
                        throw new Error('You do not have enough $SHOW.')
                    }

                    const allowance = new BigNumber(
                        await showBizContract.allowance(
                            account,
                            GREENROOM_V2_CONTRACT_ADDRESS
                        )
                    )
                    if (allowance.lt(new BigNumber(item.price))) {
                        await showBizContract.approve(
                            account,
                            GREENROOM_V2_CONTRACT_ADDRESS,
                            MAX_ALLOWANCE
                        )
                    }
                    moveTransactionToNextStep()
                }

                await mint(item, quantity)
                moveTransactionToNextStep()

                loadMintableItems()
                loadTokens()
                // toast.success('Minting succcess!!!')

                await showTransactionSuccess()
            } catch (ex: any) {
                if (!isUserRejectedError(ex)) {
                    console.log(ex)
                    const msg = parseTransactionError(ex)
                    toast.error(
                        `Error occurred while performing minting operation.${
                            msg ? ` (${msg})` : ''
                        }`
                    )
                    await showTransactionFail()
                }
            } finally {
                closeTransactionModal()
                setMinting(false)
                setMintingId(undefined)
            }
        },
        [connected, showBizBalance]
    )

    return (
        <GreenroomV2Context.Provider
            value={{
                mintableItems,
                mintableItemsLoading,
                mintableItemsLoaded,
                refreshMintableItems: loadMintableItems,

                tokens,
                tokensLoading,
                refreshTokens: loadTokens,

                minting,
                mintingId,
                startMinting,
            }}
        >
            {children}
        </GreenroomV2Context.Provider>
    )
}

export const useGreenroomV2 = (): GreenroomV2Context => {
    const context = useContext<GreenroomV2Context>(GreenroomV2Context)
    return context
}
