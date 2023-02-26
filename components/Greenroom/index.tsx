import IntroPanel from './components/IntroPanel'
import GreenroomAssetCard from './components/GreenroomAssetCard'
import { useEffect } from 'react'
import { useGreenroomV2 } from 'providers/token/GreenroomV2Provider'
import { useWeb3Connection } from 'providers/Web3ConnectionProvider'
import Information from './components/Information'

export default function Greenroom() {
    const { connected } = useWeb3Connection()
    const {
        mintableItems,
        mintableItemsLoading,
        mintableItemsLoaded,
        refreshMintableItems,
    } = useGreenroomV2()

    useEffect(() => {
        !mintableItemsLoaded && refreshMintableItems()
    }, [connected])

    return (
        <>
            {/* <IntroPanel
                link="https://www.youtube.com/embed/O5fK5R1IZ6A"
                episode="episode 6: part one"
            /> */}
            <div className="space-y-4 md:space-y-6">
                <div className="relative flex flex-col items-start justify-between gap-x-4 gap-y-4 rounded-lg bg-dark-gray p-4 md:p-6 lg:flex-row">
                    <div className="flex items-center">
                        <h2 className="flex-1 whitespace-nowrap text-[22px] md:text-[40px]">
                            Greenroom
                        </h2>
                    </div>
                </div>
                <Information />
                <div className="mt-4 mb-20 grid grid-cols-1 justify-center gap-4 sm:grid-cols-2 md:mt-6 md:justify-start md:gap-5 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5">
                    {mintableItems.map((item, i) => (
                        <GreenroomAssetCard
                            key={`greenroom-v2-item-${i}`}
                            item={item}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}
