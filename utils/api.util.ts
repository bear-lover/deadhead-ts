import { usePrivateIPFSGateway } from 'utils/helper.util'
import axios from 'axios'
import qs from 'qs'
import { API_ENDPOINT, OPENSEA_ASSET_URL } from 'config/constants'
import { Asset } from 'config/types'

export async function getAssets(
    accountAddress: string,
    contractAddresses: string[] | string
): Promise<Asset[]> {
    const response = await axios.get(`${API_ENDPOINT}/assets`, {
        params: { accountAddress, contractAddresses },
        paramsSerializer: (params) => {
            return qs.stringify(params, { indices: false })
        },
    })

    return response.data.map(({ token_address, name, token_id, metadata }) => ({
        contractAddress: token_address,
        id: token_id,
        name: `${name} #${token_id}`,
        image: metadata && usePrivateIPFSGateway(JSON.parse(metadata).image),
        url: `${OPENSEA_ASSET_URL}/${token_address}/${token_id}`,
    }))
}
