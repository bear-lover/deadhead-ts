import AssetShelf from 'components/shared/AssetShelf'
import { useAccount } from 'providers/token/AccountProvider'

export default function () {
    const { tokens, loading } = useAccount()

    return (
        <AssetShelf
            title="My Collection"
            assets={tokens}
            loading={loading}
            collectionUrl="/my-collection"
            collectionTitle="View All"
        />
    )
}
