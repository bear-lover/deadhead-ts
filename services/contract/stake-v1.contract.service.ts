import { AbiItem } from 'web3-utils'
import BaseContractService from './base.contract.service'
import abi from 'abi/earnburn.json'
import { STAKE_V1_CONTRACT_ADDRESS } from 'config/constants'
import Web3 from 'web3'

export default class StakeV1ContractService extends BaseContractService {
    mintAddress?: string

    constructor(web3: Web3, mintAddress?: string) {
        super(web3, STAKE_V1_CONTRACT_ADDRESS, abi as AbiItem[])
        this.mintAddress = mintAddress
    }

    stake(from: string, tokenIds: string[], months: number[]) {
        return this.contract.methods
            .stakeBatch(this.mintAddress, tokenIds, months)
            .send({
                from,
            })
    }

    unstake(from: string, tokenId: string) {
        return this.send(this.contract.methods.unstake(tokenId), from)
    }

    unstakeBatch(from: string, tokenIds: string[]) {
        return this.send(this.contract.methods.unstakeBatch(tokenIds), from)
    }

    claimRewards(from: string) {
        return this.send(this.contract.methods.claimRewards(), from)
    }

    async getStakedTokenIds(address: string) {
        const balance = await this.balanceOf(address)
        const tokens: any[] = []

        for (let i = 0; i < balance; i++) {
            const token = await this.contract.methods
                .tokenOfOwnerByIndex(address, i)
                .call()
            tokens.push(token)
        }

        return tokens
    }

    unclaimedRewards(tokenId: string) {
        return this.contract.methods.unclaimedRewards(tokenId).call()
    }

    async getStakedToken(tokenId: string) {
        return this.contract.methods
            .localTokenIdToStakedToken(this.mintAddress, tokenId)
            .call()
    }
}
