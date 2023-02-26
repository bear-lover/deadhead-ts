import {
    getAssetsByIdsInCollection,
    getOwnerAssetsByCollection,
} from 'utils/opensea.util'
import {
    SKULLTROOPERS_CONTRACT_ADDRESS,
    SKULLTROOPERS_HEROS,
} from 'config/constants'
import { TokenType } from 'config/types'

export async function getHeros() {
    if (!SKULLTROOPERS_HEROS?.length) return []

    return getAssetsByIdsInCollection(
        SKULLTROOPERS_CONTRACT_ADDRESS,
        SKULLTROOPERS_HEROS
    )
}

export async function getOwnerAssets(account: string) {
    return (
        await getOwnerAssetsByCollection(
            account,
            SKULLTROOPERS_CONTRACT_ADDRESS
        )
    ).map(({ contractAddress, ...token }) => ({
        type: TokenType.SKULLTROOPERS,
        ...token,
    }))
}
