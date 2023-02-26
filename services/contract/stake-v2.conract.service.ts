import { AbiItem } from 'web3-utils'
import BaseContractService from './base.contract.service'
import abi from 'abi/stakev2.json'
import { STAKE_V2_CONTRACT_ADDRESS } from 'config/constants'
import Web3 from 'web3'

export default class StakeV2ContractService extends BaseContractService {
    mintAddress?: string

    constructor(web3: Web3, mintAddress?: string) {
        super(web3, STAKE_V2_CONTRACT_ADDRESS, abi as AbiItem[])
        this.mintAddress = mintAddress
    }

    async stake(from: string, tokenIds: string[], months: number) {
        return this.send(
            this.contract.methods.stakeBatch(
                this.mintAddress,
                tokenIds,
                months
            ),
            from
        )
    }

    async unstake(from: string, tokenId: string) {
        return this.send(
            this.contract.methods.unstake(this.mintAddress, tokenId),
            from
        )
    }

    async unstakeBatch(from: string, tokenIds: string[]) {
        return this.send(
            this.contract.methods.unstakeBatch(this.mintAddress, tokenIds),
            from
        )
    }

    claimRewards(from: string) {
        return this.send(
            this.contract.methods.claimRewards(),
            from
        )
    }

    getStakedTokenIds(address: string) {
        return this.contract.methods
            .stakedTokensOfOwner(this.mintAddress, address)
            .call()
    }

    unclaimedRewards(tokenId: string) {
        return this.contract.methods
            .unclaimedRewards(this.mintAddress, tokenId)
            .call()
    }

    getStakedToken(tokenId: string) {
        return this.contract.methods
            .tokenIdToStakedToken(this.mintAddress, tokenId)
            .call()
    }
}
