import { GreenroomToken } from 'config/types'
import GenericAssetCard from './GenericAssetCard'

interface GreenroomCardProps {
    token: GreenroomToken
}

export default function GreenroomCard({ token }: GreenroomCardProps) {
    return (
        <GenericAssetCard token={token}>
            <div>Balance: {token.balance}</div>
        </GenericAssetCard>
    )
}
