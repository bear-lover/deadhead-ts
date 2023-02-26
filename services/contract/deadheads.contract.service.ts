import { usePrivateIPFSGateway } from 'utils/helper.util'
import { TokenType } from 'config/types'
import { AbiItem } from 'web3-utils'
import BaseContractService from './base.contract.service'
import abi from 'abi/deadheads.json'
import { OPENSEA_ASSET_URL, DEADHEADS_CONTRACT_ADDRESS } from 'config/constants'
import Web3 from 'web3'

export default class DeadHeadsContractService extends BaseContractService {
    constructor(web3: Web3) {
        super(web3, DEADHEADS_CONTRACT_ADDRESS, abi as AbiItem[])
    }

    async getTokensByAccount(accountAddress: string) {
        return (await super.getTokensByAccount(accountAddress)).map(
            ({ id, metadata: { image } }) => ({
                id,
                type: TokenType.DEADHEADS,
                name: `DeadHeads #${id}`,
                image: usePrivateIPFSGateway(image),
                url: `${OPENSEA_ASSET_URL}/${DEADHEADS_CONTRACT_ADDRESS}/${id}`,
            })
        )
    }
}
