import {
    getAssetsByIdsInCollection,
    getOwnerAssetsByCollection,
} from 'utils/opensea.util'
import { DEADHEADS_CONTRACT_ADDRESS, DEADHEADS_HEROS } from 'config/constants'
import { TokenType } from 'config/types'

export async function getHeros() {
    if (!DEADHEADS_HEROS?.length) return []

    return getAssetsByIdsInCollection(
        DEADHEADS_CONTRACT_ADDRESS,
        DEADHEADS_HEROS
    )
}

export async function getOwnerAssets(account: string) {
    return (
        await getOwnerAssetsByCollection(account, DEADHEADS_CONTRACT_ADDRESS)
    ).map(({ contractAddress, ...token }) => ({
        type: TokenType.DEADHEADS,
        ...token,
    }))
}
