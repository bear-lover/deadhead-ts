import AssetShelf from 'components/shared/AssetShelf'
import { getHeros } from 'services/opensea/greenroom.opensea.service'
import { GREENROOM_COLLECTION_URL } from 'config/constants'
import useSWRImmutable from 'swr/immutable'

export default function () {
    const { data: assets, isValidating } = useSWRImmutable('/greenroom/heros', getHeros)

    return (
        <AssetShelf
            title="Greenroom"
            assets={assets}
            loading={isValidating}
            collectionUrl={GREENROOM_COLLECTION_URL}
        />
    )
}
