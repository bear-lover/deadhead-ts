import {
    getAssetsByIdsInCollection,
    getOwnerAssetsByCollection,
} from 'utils/opensea.util'
import { HALOHEADS_CONTRACT_ADDRESS, HALOHEADS_HEROS } from 'config/constants'
import { TokenType } from 'config/types'

export async function getHeros() {
    if (!HALOHEADS_HEROS?.length) return []

    return getAssetsByIdsInCollection(
        HALOHEADS_CONTRACT_ADDRESS,
        HALOHEADS_HEROS
    )
}

export async function getOwnerAssets(account: string) {
    return (
        await getOwnerAssetsByCollection(account, HALOHEADS_CONTRACT_ADDRESS)
    ).map(({ contractAddress, ...token }) => ({
        type: TokenType.HALOHEADS,
        ...token,
    }))
}
