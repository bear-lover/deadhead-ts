import { usePrivateIPFSGateway } from 'utils/helper.util'
import camelcaseKeys from 'camelcase-keys'
import { GreenroomV2Item } from 'config/types'
import { GREENROOM_V2_API_ENDPOINT } from 'config/constants'
import axios from 'axios'
import snakecaseKeys from 'snakecase-keys'

export async function getItems(): Promise<GreenroomV2Item[]> {
    return axios.get(`${GREENROOM_V2_API_ENDPOINT}/items`).then(({ data }) =>
        camelcaseKeys(data, { deep: true }).map((item: any) => {
            const { mediaType, image, ...newItem } = item

            const media = usePrivateIPFSGateway(item.image)
            if (mediaType == 'video') newItem.video = media
            else newItem.image = media

            newItem.totalSupply = 0

            return newItem
        })
    )
}

export async function getSignature(
    accountAddress: string,
    itemId: string
): Promise<string> {
    return axios
        .post(
            `${GREENROOM_V2_API_ENDPOINT}/signature`,
            snakecaseKeys(
                { address: accountAddress, collectionId: itemId },
                { deep: true }
            )
        )
        .then(({ data }) => data)
}
