import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionOptions } from 'config/types'
import { usePrivateIPFSGateway } from 'utils/helper.util'

export default class BaseContractService {
    contractAddress: string
    contract: Contract

    constructor(web3: Web3, contractAddress: string, abi: AbiItem[]) {
        this.contractAddress = contractAddress
        this.contract = new web3.eth.Contract(abi, contractAddress)
    }

    balanceOf(address: string) {
        return this.contract.methods.balanceOf(address).call()
    }

    setApprovalForAll(accountAddress: string, contractAddress: string) {
        return this.contract.methods
            .setApprovalForAll(contractAddress, true)
            .send({
                from: accountAddress,
            })
    }

    isApprovedForAll(accountAddress: string, contractAddress: string) {
        return this.contract.methods
            .isApprovedForAll(accountAddress, contractAddress)
            .call()
    }

    getTokenIdByIndex(accountAddress: string, index: number) {
        return this.contract.methods
            .tokenOfOwnerByIndex(accountAddress, index)
            .call()
    }

    async getTokensByAccount(accountAddress: string) {
        return this.balanceOf(accountAddress).then((tokenCount: number) =>
            Promise.all(
                Array.from({ length: tokenCount }).map(async (_, i) =>
                    this.getTokenIdByIndex(accountAddress, i).then(
                        async (id: string) => ({
                            id,
                            metadata: await this.getTokenURI(id).then(
                                (uri: string) =>
                                    fetch(uri).then((res) => res.json())
                            ),
                        })
                    )
                )
            )
        )
    }

    getTokenURI(tokenId: string) {
        return this.contract.methods
            .tokenURI(tokenId)
            .call()
            .then((uri: string) => usePrivateIPFSGateway(uri))
    }

    async send(
        action: any,
        optionsOrFrom: TransactionOptions | string,
        value: string | undefined = undefined
    ) {
        const options: TransactionOptions =
            typeof optionsOrFrom == 'object'
                ? optionsOrFrom
                : { from: optionsOrFrom }

        if (value) {
            options.value = value
        }

        options.gas = Math.round(1.2 * (await action.estimateGas(options)))

        return action.send(options)
    }
}
