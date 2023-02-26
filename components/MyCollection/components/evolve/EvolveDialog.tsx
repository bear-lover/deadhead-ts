import Image from 'next/image'
import Modal from 'components/shared/Modal'
import { useCallback, useMemo, useState } from 'react'
import { useEvolve } from 'components/MyCollection/components/evolve/EvolveProvider'
import { Loader } from 'components/shared/Loader'
import { useVessels } from 'providers/token/VesselsProvider'
import SelectableTokenList from '../SelectableTokenList'

export default function EvolveDialog() {
    const {
        dialogOpen,
        setDialogOpen,
        vessels: selectedVessels,
        setVessels: setSelectedVessels,

        evolving,
        startEvolving,
    } = useEvolve()
    const selectedVesselIds: string[] = useMemo(
        () => selectedVessels.map(({ id }) => id),
        [selectedVessels]
    )

    const { tokens: vessels } = useVessels()

    const selectVessel = useCallback(
        (vessel) => {
            setSelectedVessels((vessels) =>
                selectedVesselIds.includes(vessel.id)
                    ? vessels.filter(({ id }) => id != vessel.id)
                    : [...vessels, vessel]
            )
        },
        [selectedVesselIds]
    )

    const selectAll = useCallback(() => {
        setSelectedVessels([...vessels])
    }, [vessels])
    const selectNone = useCallback(() => {
        setSelectedVessels([])
    }, [])

    const [agreed, setAgreed] = useState<boolean>()

    useMemo(() => {
        setAgreed(false)
    }, [dialogOpen])

    const handleEvolve = useCallback(() => {
        startEvolving()
    }, [startEvolving])

    return (
        <Modal
            title="Evolve your Vessels NFTs"
            description={`The time has come! HaloHeads can arise from their vessels and be set free.`}
            show={dialogOpen}
            onClose={() => !evolving && setDialogOpen(false)}
        >
            <div className="min-h-[40vh] py-6 md:py-8">
                <div className="mb-4 flex items-center md:mb-6">
                    <button
                        className="font-semibold text-gray-1 hover:text-tinted-white hover:underline focus:underline"
                        onClick={selectAll}
                    >
                        Select All
                    </button>
                    <span className="mx-2 block h-3 w-[2px] bg-gray-1" />
                    <button
                        className="font-semibold text-gray-1 hover:text-tinted-white hover:underline focus:underline"
                        onClick={selectNone}
                    >
                        Select None
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-4">
                    <SelectableTokenList
                        tokens={vessels}
                        selectedTokens={selectedVessels}
                        selectToken={selectVessel}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-between gap-4 rounded-xl bg-black p-4 shadow-xl shadow-black/10 md:flex-row">
                <div className="flex items-center justify-center"></div>
                <div className="flex items-center">
                    <label className="mr-16 flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2 h-5 w-5"
                            checked={agreed}
                            disabled={evolving}
                            onChange={(e) => setAgreed(!agreed)}
                        />{' '}
                        Evolving &amp; license agreement
                    </label>
                    <button
                        className="w-full rounded-md border-2 border-black bg-tinted-white px-6 py-2 font-vimland text-xl uppercase text-black ring-tinted-white hover:bg-opacity-90 focus:outline-none focus:ring disabled:bg-opacity-100 disabled:opacity-50 md:w-auto md:px-16"
                        disabled={
                            selectedVesselIds.length <= 0 || !agreed || evolving
                        }
                        onClick={handleEvolve}
                    >
                        {evolving && (
                            <div className="mr-2">
                                <Loader />
                            </div>
                        )}
                        Continue
                    </button>
                </div>
            </div>
        </Modal>
    )
}
