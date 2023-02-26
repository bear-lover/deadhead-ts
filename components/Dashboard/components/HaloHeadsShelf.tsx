import AssetShelf from 'components/shared/AssetShelf'
import { getHeros } from 'services/opensea/haloheads.opensea.service'
import { HALOHEADS_COLLECTION_URL } from 'config/constants'
import useSWRImmutable from 'swr/immutable'

export default function () {
    const { data: assets, isValidating } = useSWRImmutable('/haloheads/heros', getHeros)
    return (
        <AssetShelf
            title="HaloHeads"
            assets={assets}
            loading={isValidating}
            collectionUrl={HALOHEADS_COLLECTION_URL}
        />
    )
}
