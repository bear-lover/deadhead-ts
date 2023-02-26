import { DEADHEADS_CONTRACT_ADDRESS } from 'config/constants'
import { TokenType } from 'config/types'
import { getAssets } from 'utils/api.util'

export async function getOwnerAssets(accountAddress: string) {
    return (await getAssets(accountAddress, DEADHEADS_CONTRACT_ADDRESS)).map(
        ({contractAddress, ...token}) => ({
            type: TokenType.DEADHEADS,
            ...token,
        })
    )
}
