import { OPENSEA_ASSET_URL } from 'config/constants'
import { usePrivateIPFSGateway } from 'utils/helper.util'
import { TokenType } from 'config/types'
import { AbiItem } from 'web3-utils'
import BaseContractService from './base.contract.service'
import abi from 'abi/vessel.json'
import { VESSEL_CONTRACT_ADDRESS } from 'config/constants'
import Web3 from 'web3'

export default class VesselsContractService extends BaseContractService {
    constructor(web3: Web3) {
        super(web3, VESSEL_CONTRACT_ADDRESS, abi as AbiItem[])
    }

    async evolve(
        from: string,
        dhTokenId: string,
        ticketId: string,
        tokenType: string,
        signature: string
    ) {
        return this.send(
            this.contract.methods.evolve(
                dhTokenId,
                ticketId,
                tokenType,
                signature
            ),
            from
        )
    }

    async getTokensByAccount(accountAddress: string) {
        return (await super.getTokensByAccount(accountAddress)).map(
            ({ id, metadata: { image } }) => ({
                id,
                type: TokenType.VESSELS,
                name: `Vessels #${id}`,
                image: usePrivateIPFSGateway(image),
                url: `${OPENSEA_ASSET_URL}/${VESSEL_CONTRACT_ADDRESS}/${id}`,
            })
        )
    }
}
