import { getOwnerAssetsByCollection } from 'utils/opensea.util'
import { DEADTICKETS_CONTRACT_ADDRESS } from 'config/constants'
import { TokenType } from 'config/types'

export async function getOwnerAssets(account: string) {
    return (
        await getOwnerAssetsByCollection(account, DEADTICKETS_CONTRACT_ADDRESS)
    ).map(({ contractAddress, ...token }) => ({
        type: TokenType.DEADTICKETS,
        ...token,
    }))
}
