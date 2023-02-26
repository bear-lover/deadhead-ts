import GenericAssetCard from './GenericAssetCard'
import { useCallback } from 'react'
import { useEvolve } from '../evolve/EvolveProvider'
import { Token } from 'config/types'

interface VesselCardProps {
    token: Token
}

export default function VesselCard({ token }: VesselCardProps) {
    const {
        setDialogOpen: setEvloveDialogOpen,
        setVessels: setEvolvingVessels,
    } = useEvolve()

    const handleEvolveClick = useCallback(() => {
        setEvolvingVessels([token])
        setEvloveDialogOpen(true)
    }, [])

    return (
        <GenericAssetCard token={token}>
            <button
                className="block w-full border border-white bg-transparent py-2 text-center text-[10px] uppercase transition ease-in-out hover:bg-white hover:text-gray-1"
                onClick={handleEvolveClick}
            >
                Evolve
            </button>
        </GenericAssetCard>
    )
}
