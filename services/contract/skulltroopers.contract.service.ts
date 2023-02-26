import { AbiItem } from 'web3-utils'
import BaseContractService from './base.contract.service'
import abi from 'abi/skulltroopers.json'
import { SKULLTROOPERS_CONTRACT_ADDRESS } from 'config/constants'
import Web3 from 'web3'

export default class SkullTroopersContractService extends BaseContractService {
    constructor(web3: Web3) {
        super(web3, SKULLTROOPERS_CONTRACT_ADDRESS, abi as AbiItem[])
    }

    async getTokensByAccount(accountAddress: string) {
        throw new Error('Not Supported')
    }
}
