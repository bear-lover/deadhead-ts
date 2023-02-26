import {
    getAssetsByIdsInCollection,
    getOwnerAssetsByCollection,
} from 'utils/opensea.util'
import { SEASON_ONE_CONTRACT_ADDRESS, GREENROOM_HEROS } from 'config/constants'
import { TokenType } from 'config/types'

export async function getHeros() {
    if (!GREENROOM_HEROS?.length) return []

    return getAssetsByIdsInCollection(
        SEASON_ONE_CONTRACT_ADDRESS,
        GREENROOM_HEROS
    )
}

export async function getOwnerAssets(account: string) {
    return (
        await getOwnerAssetsByCollection(account, SEASON_ONE_CONTRACT_ADDRESS)
    ).map(({ contractAddress, ...token }) => ({
        type: TokenType.GREENROOM,
        ...token,
    }))
}
