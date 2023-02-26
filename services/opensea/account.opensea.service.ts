import { getOwnerAssetsByCollections } from 'utils/opensea.util'
import {
    DEADHEADS_CONTRACT_ADDRESS,
    SKULLTROOPERS_CONTRACT_ADDRESS,
    DEADTICKETS_CONTRACT_ADDRESS,
    HALOHEADS_CONTRACT_ADDRESS,
    VESSEL_CONTRACT_ADDRESS,
    SEASON_ONE_CONTRACT_ADDRESS,
    GREENROOM_V2_CONTRACT_ADDRESS,
} from 'config/constants'

export async function getAllNonStakedAssets(account: string) {
    return getOwnerAssetsByCollections(
        account,
        [
            DEADHEADS_CONTRACT_ADDRESS,
            SKULLTROOPERS_CONTRACT_ADDRESS,
            DEADTICKETS_CONTRACT_ADDRESS,
            HALOHEADS_CONTRACT_ADDRESS,
            DEADTICKETS_CONTRACT_ADDRESS,
            VESSEL_CONTRACT_ADDRESS,
            SEASON_ONE_CONTRACT_ADDRESS,
            GREENROOM_V2_CONTRACT_ADDRESS
        ].filter((address) => address)
    )
}
