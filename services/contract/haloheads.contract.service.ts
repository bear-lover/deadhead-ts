import { AbiItem } from 'web3-utils'
import BaseContractService from './base.contract.service'
import abi from 'abi/haloheads.json'
import { HALOHEADS_CONTRACT_ADDRESS, OPENSEA_ASSET_URL } from 'config/constants'
import Web3 from 'web3'
import { TokenType } from 'config/types'
import { usePrivateIPFSGateway } from 'utils/helper.util'

export default class HaloHeadsContractService extends BaseContractService {
    constructor(web3: Web3) {
        super(web3, HALOHEADS_CONTRACT_ADDRESS, abi as AbiItem[])
    }

    evolve(from: string, vesselTokenId: string) {
        return this.send(this.contract.methods.evolve(vesselTokenId), from)
    }

    batchEvolve(from: string, vesselTokenIds: string[]) {
        return this.send(
            this.contract.methods.batchEvolve(vesselTokenIds),
            from
        )
    }

    async getTokensByAccount(accountAddress: string) {
        return (await super.getTokensByAccount(accountAddress)).map(
            ({ id, metadata: { image } }) => ({
                id,
                type: TokenType.HALOHEADS,
                name: `HaloHeads #${id}`,
                image: usePrivateIPFSGateway(image),
                url: `${OPENSEA_ASSET_URL}/${HALOHEADS_CONTRACT_ADDRESS}/${id}`,
            })
        )
    }
}
