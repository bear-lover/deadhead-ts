import AssetShelf from 'components/shared/AssetShelf'
import { getHeros } from 'services/opensea/deadheads.opensea.service'
import { DEADHEADS_COLLECTION_URL } from 'config/constants'
import useSWRImmutable from 'swr/immutable'

export default function () {
    const { data: assets, isValidating } = useSWRImmutable(
        '/deadheads/heros',
        getHeros
    )

    return (
        <AssetShelf
            title="DeadHeads"
            assets={assets}
            loading={isValidating}
            collectionUrl={DEADHEADS_COLLECTION_URL}
        />
    )
}
