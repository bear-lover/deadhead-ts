import {
    getAssetsByIdsInCollection,
    getOwnerAssetsByCollection,
} from 'utils/opensea.util'
import {
    GREENROOM_V2_CONTRACT_ADDRESS,
    GREENROOM_V2_HEROS,
} from 'config/constants'
import { TokenType } from 'config/types'

export async function getHeros() {
    if (!GREENROOM_V2_HEROS?.length) return []

    return getAssetsByIdsInCollection(
        GREENROOM_V2_CONTRACT_ADDRESS,
        GREENROOM_V2_HEROS
    )
}

export async function getOwnerAssets(account: string) {
    return (
        await getOwnerAssetsByCollection(account, GREENROOM_V2_CONTRACT_ADDRESS)
    ).map(({ contractAddress, ...token }) => ({
        type: TokenType.GREENROOM,
        ...token,
    }))
}
