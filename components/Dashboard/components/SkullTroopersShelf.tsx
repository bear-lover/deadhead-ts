import AssetShelf from 'components/shared/AssetShelf'
import { getHeros } from 'services/opensea/skulltroopers.opensea.service'
import { SKULLTROOPERS_COLLECTION_URL } from 'config/constants'
import useSWRImmutable from 'swr/immutable'

export default function () {
    const { data: assets, isValidating } = useSWRImmutable(
        '/skulltroopers/heros',
        getHeros
    )

    return (
        <AssetShelf
            title="SkullTroopers"
            assets={assets}
            loading={isValidating}
            collectionUrl={SKULLTROOPERS_COLLECTION_URL}
        />
    )
}
