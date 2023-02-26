import { getOwnerAssetsByCollection } from 'utils/opensea.util'
import { VESSEL_CONTRACT_ADDRESS } from 'config/constants'
import { TokenType } from 'config/types'

export async function getOwnerAssets(account: string) {
    return (
        await getOwnerAssetsByCollection(account, VESSEL_CONTRACT_ADDRESS)
    ).map(({ contractAddress, ...token }) => ({
        type: TokenType.VESSELS,
        ...token,
    }))
}
