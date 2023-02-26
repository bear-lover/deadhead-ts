import { BigNumber } from 'bignumber.js'
import { usePrivateIPFSGateway } from 'utils/helper.util'
import { GreenroomV2Item, TokenType, TypedToken } from 'config/types'
import { AbiItem } from 'web3-utils'
import BaseContractService from './base.contract.service'
import abi from 'abi/greenroom-v2.json'
import {
    OPENSEA_ASSET_URL,
    GREENROOM_V2_CONTRACT_ADDRESS,
} from 'config/constants'
import Web3 from 'web3'
import { getItems } from 'services/api/greenroom-v2.api.service'

export default class GreenroomV2ContractService extends BaseContractService {
    constructor(web3: Web3) {
        super(web3, GREENROOM_V2_CONTRACT_ADDRESS, abi as AbiItem[])
    }

    mintItem(from: string, itemId: string, ticketsToBurn: string[]) {
        return this.send(
            this.contract.methods.mintItem(itemId, ticketsToBurn),
            from
        )
    }

    totalSupply(itemId: string) {
        return this.contract.methods.totalSupply(itemId).call()
    }

    balancesOf(accountAddress: string, itemIds: string[]) {
        const accountAddresses = new Array(itemIds.length).fill(accountAddress)
        return this.contract.methods
            .balanceOfBatch(accountAddresses, itemIds)
            .call()
    }

    async getTokensByAccount(accountAddress: string) {
        const { itemIds, itemMap } = await this.loadItems()

        const balances = await this.balancesOf(accountAddress, itemIds)

        const tokens = itemIds
            .map((id: string, i: number) => ({ id, balance: balances[i] }))
            .filter(({ balance }) => balance > 0)

        return tokens.map(({ id, balance }) => ({
            type: TokenType.GREENROOM_V2,
            balance,
            ...itemMap.get(id)!,
            url: `${OPENSEA_ASSET_URL}/${GREENROOM_V2_CONTRACT_ADDRESS}/${id}`,
        }))
    }

    async getItem(itemId: string) {
        return this.contract.methods.items(itemId).call()
    }

    async mintableItems() {
        const { activeItemIds, itemMap } = await this.loadItems()

        return (
            await Promise.all(
                activeItemIds.map(async (id) => {
                    let [item, totalSupply] = await Promise.all([
                        this.getItem(id),
                        this.totalSupply(id),
                    ])

                    item.maxSupply = parseInt(item.maxSupply)
                    item.purchaseType = parseInt(item.purchaseType)
                    totalSupply = parseInt(totalSupply)

                    const offChainItem = itemMap.get(id)
                    if (
                        item.active &&
                        item.maxSupply > 0 &&
                        item.owner !=
                            '0x0000000000000000000000000000000000000000'
                    )
                        return {
                            ...offChainItem,
                            ...item,
                            totalSupply,
                        }
                    else {
                        return {
                            ...offChainItem,
                        }
                    }
                })
            )
        ).filter(
            ({ active, totalSupply, maxSupply }) =>
                active/* && maxSupply > totalSupply*/
        )
    }

    async loadItems() {
        const items = await getItems()

        const itemMap = new Map<string, GreenroomV2Item>()
        const itemIds: string[] = []
        const activeItemIds: string[] = []

        items.forEach((item) => {
            itemMap.set(item.id, item)
            itemIds.push(item.id)
            item.active && activeItemIds.push(item.id)
        })

        return {
            itemMap,
            itemIds,
            activeItemIds,
        }
    }

    async createItem(
        from: string,
        item: GreenroomV2Item,
        quantity: number,
        signature: string
    ) {
        const { owner, maxSupply, mintLimit, price, purchaseType, id } = item

        const value =
            purchaseType === 0
                ? new BigNumber(price).times(quantity).toString(10)
                : '0'

        return this.send(
            this.contract.methods.createItem(
                maxSupply,
                mintLimit,
                quantity,
                price,
                purchaseType,
                id,
                signature
            ),
            from,
            value
        )
    }

    async mint(from: string, item: GreenroomV2Item, quantity: number) {
        const { price, purchaseType, id } = item

        const value =
            purchaseType === 0
                ? new BigNumber(price).times(quantity).toString(10)
                : '0'

        return this.send(
            this.contract.methods.mint(id, quantity),
            from,
            value
        )
    }
}
