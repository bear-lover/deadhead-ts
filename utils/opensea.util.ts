import axios from 'axios'
import qs from 'qs'
import { OPENSEA_API_KEY, OPENSEA_API_URL } from 'config/constants'
import { Asset } from 'config/types'

const headers: { 'X-API-KEY'?: string } =
    OPENSEA_API_URL.indexOf('testnets') > -1
        ? {}
        : {
              'X-API-KEY': OPENSEA_API_KEY!,
          }

export function getOffsetFromPage(page = 1, limit = 50) {
    return (page - 1) * limit
}

async function getAssets(params: any) {
    const response = await axios.get(`${OPENSEA_API_URL}/assets`, {
        params,
        headers,
        paramsSerializer: (params) => {
            return qs.stringify(params, { indices: false })
        },
    })

    return toAssets(response.data.assets)
}
export async function getAssetsByCollection(
    contractAddress: string,
    offset = 0,
    limit = 50
) {
    return getAssets({
        asset_contract_address: contractAddress,
        order_direction: 'asc',
        limit,
        offset,
    })
}

export async function getOwnerAssetsByCollection(
    owner: string,
    contractAddress: string
) {
    const limit = 50
    let offset = 0

    let assets: Asset[] = []

    do {
        const page = await getAssets({
            owner,
            asset_contract_address: contractAddress,
            order_direction: 'asc',
            limit,
            offset,
        })
        assets = assets.concat(page)

        if (page.length < limit) break
        offset += limit
    } while (offset < limit * 100) //assume any wallet will not have more than 5K tokens

    return assets
}

export async function getOwnerAssetsByCollections(
    owner: string,
    contractAddresses: string[]
) {
    const limit = 50
    let offset = 0

    let assets: Asset[] = []

    do {
        const page = await getAssets({
            owner,
            asset_contract_addresses: contractAddresses,
            order_direction: 'asc',
            limit,
            offset,
        })
        assets = assets.concat(page)

        if (page.length < limit) break
        offset += limit
    } while (offset < limit * 100) //assume any wallet will not have more than 5K tokens

    return assets
}

export async function getAssetsByIdsInCollection(
    contractAddress: string,
    tokenIds: any[]
) {
    return getAssets({
        asset_contract_address: contractAddress,
        order_direction: 'asc',
        token_ids: tokenIds,
    })
}

function toAssets(openSeaAssets: any[]) {
    return openSeaAssets.map(
        ({
            token_id,
            name,
            permalink,
            image_url,
            animation_url,
            asset_contract: { name: contractName, address: contractAddress },
        }) =>
            ({
                id: token_id,
                name:
                    (!name?.startsWith('#') && name) ||
                    `${contractName} #${token_id}`,
                image: image_url,
                url: permalink,
                video: animation_url,
                contractAddress,
            } as Asset)
    )
}
