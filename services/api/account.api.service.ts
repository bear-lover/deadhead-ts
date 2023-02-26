import { usePrivateIPFSGateway } from 'utils/helper.util'
import { TokenType } from 'config/types'
import { getAssets } from 'utils/api.util'
import {
    DEADHEADS_CONTRACT_ADDRESS,
    SKULLTROOPERS_CONTRACT_ADDRESS,
    DEADTICKETS_CONTRACT_ADDRESS,
    HALOHEADS_CONTRACT_ADDRESS,
    VESSEL_CONTRACT_ADDRESS,
    SEASON_ONE_CONTRACT_ADDRESS,
    OPENSEA_ASSET_URL,
} from 'config/constants'

export async function getAllNonStakedAssets(account: string) {
    return await getAssets(
        account,
        [
            DEADHEADS_CONTRACT_ADDRESS,
            SKULLTROOPERS_CONTRACT_ADDRESS,
            DEADTICKETS_CONTRACT_ADDRESS,
            HALOHEADS_CONTRACT_ADDRESS,
            DEADTICKETS_CONTRACT_ADDRESS,
            VESSEL_CONTRACT_ADDRESS,
            // SEASON_ONE_CONTRACT_ADDRESS,
        ].filter((address) => address)
    )
}
