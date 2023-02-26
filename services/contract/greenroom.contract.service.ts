import { usePrivateIPFSGateway } from 'utils/helper.util'
import { TokenType } from 'config/types'
import { AbiItem } from 'web3-utils'
import BaseContractService from './base.contract.service'
import abi from 'abi/seasonone.json'
import {
    OPENSEA_ASSET_URL,
    SEASON_ONE_CONTRACT_ADDRESS,
} from 'config/constants'
import Web3 from 'web3'

export default class GreenroomContractService extends BaseContractService {
    constructor(web3: Web3) {
        super(web3, SEASON_ONE_CONTRACT_ADDRESS, abi as AbiItem[])
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

    async itemIds() {
        return Array.from(
            Array(
                parseInt(await this.contract.methods.totalItems().call())
            ).keys()
        ).map((val) => val + '')
    }

    async getTokensByAccount(accountAddress: string) {
        const itemIds = await this.itemIds()
        const balances = await this.balancesOf(accountAddress, itemIds)

        const tokens = itemIds
            .map((id: string, i: number) => ({ id, balance: balances[i] }))
            .filter(({ balance }) => balance > 0)

        return Promise.all(
            tokens.map(async ({ id, balance }) => ({
                type: TokenType.GREENROOM,
                id,
                balance,
                ...(await Promise.all([
                    this.getItem(id),
                    this.getMetadata(id),
                ]).then(([{ itemType }, { name, image }]) => ({
                    isEpisode: itemType == 0,
                    name,
                    image: itemType == 0 ? null : image,
                    video: itemType == 0 ? image : null,
                    url: `${OPENSEA_ASSET_URL}/${SEASON_ONE_CONTRACT_ADDRESS}/${id}`,
                }))),
            }))
        )
    }

    getBaseURI() {
        return this.contract.methods.uri(0).call()
    }

    getTokenURI(itemId: string) {
        return this.getBaseURI().then((uri: string) => {
            return usePrivateIPFSGateway(uri).replace(
                '{id}',
                Number(itemId).toString(16).padStart(64, '0')
            )
        })
    }

    getMetadata(itemId: string) {
        return this.getTokenURI(itemId).then((uri: string) =>
            fetch(uri)
                .then((res) => res.json())
                .then(({ name, image }) => ({
                    name,
                    image: usePrivateIPFSGateway(image),
                }))
        )
    }

    getItem(itemId: string) {
        return this.contract.methods.items(itemId).call()
    }

    // // mintableItems() {
    // //     return this.activeItemIds().then((activeItems) => {
    // //         let items = [...activeItems]

    // //         // items.splice(0, 47)

    // //         return items
    // //     })
    // // }

    // hasDeadHeads(address) {
    //     return this.contract.methods.hasDeadHeads(address).call()
    // }

    // mintedEpisodes(accountAddress: string, itemId: string) {
    //     return this.contract.methods
    //         .mintedEpisodes(accountAddress, itemId)
    //         .call()
    // }

    // async maxTicketId() {
    //     return process.env.VUE_APP_MAX_TICKET_ID
    // }
}
