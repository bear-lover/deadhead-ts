import { AbiItem } from 'web3-utils'
import BaseContractService from './base.contract.service'
import abi from 'abi/showbiz.json'
import { SHOWBIZ_TOKEN_ADDRESS } from 'config/constants'
import Web3 from 'web3'

export default class ShowBizContractService extends BaseContractService {
    constructor(web3: Web3) {
        super(web3, SHOWBIZ_TOKEN_ADDRESS, abi as AbiItem[])
    }

    balanceOf(accountAddress: string) {
        return this.contract.methods.balanceOf(accountAddress).call()
    }

    allowance(from: string, spender: string) {
        return this.contract.methods.allowance(from, spender).call()
    }

    approve(from: string, spender: string, amount: string) {
        return this.send(this.contract.methods.approve(spender, amount), from)
    }
}
