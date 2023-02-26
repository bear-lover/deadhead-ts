import Image, { StaticImageData } from 'next/image'
import Modal from 'components/shared/Modal'
import { useCallback } from 'react'
import { TokenType } from 'config/types'
import { useTypeSelect } from './TypeSelectProvider'

import deadHeadsImage from 'public/images/token-types/deadheads.png'
import skullTroopersImage from 'public/images/token-types/skulltroopers.png'
import haloHeadsImage from 'public/images/token-types/haloheads.png'

const tokenTypes: [TokenType, StaticImageData][] = [
    [TokenType.DEADHEADS, deadHeadsImage],
    [TokenType.SKULLTROOPERS, skullTroopersImage],
    [TokenType.HALOHEADS, haloHeadsImage],
]

export default function TypeSelectDialog() {
    const {
        dialogOpen,
        setDialogOpen,
        tokenType: selectedTokenType,
        setTokenType: setSelectedTokenType,
        dispatch,
    } = useTypeSelect()

    return (
        <Modal
            title="Select Token Type"
            show={dialogOpen}
            onClose={() => setDialogOpen(false)}
        >
            <div className="py-6 md:py-8">
                <div className="flex flex-wrap justify-center gap-4 py-6 md:gap-16 md:py-8">
                    {tokenTypes.map(([type, image], i) => {
                        const selected = type == selectedTokenType
                        return (
                            <button
                                className="cursor-pointer flex flex-col group"
                                key={`token-type-select-dialog-type-${i}`}
                                onClick={async () => dispatch(type)}
                            >
                                <span
                                    className={`relative flex aspect-square w-[200px] items-center overflow-hidden rounded-xl border-4 bg-black/30 px-2 transition ${
                                        selected
                                            ? 'border-tinted-white'
                                            : 'border-transparent group-hover:border-tinted-white/50'
                                    }`}
                                >
                                    <Image src={image} />
                                </span>
                                <span className="mt-2 text-center font-vimland text-2xl uppercase">
                                    {type.toString()}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </Modal>
    )
}
