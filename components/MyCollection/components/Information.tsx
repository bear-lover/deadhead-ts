import Collapsible from 'components/shared/Collapsible'
import { Link } from 'components/shared/Link'

export default function Information() {
    return (
        <Collapsible title="Information">
            <div className="mt-6 md:mt-8 grid grid-col-1 md:grid-cols-2 gap-6 md:gap-8">
                <article className="space-y-2 md:space-y-4 md: pr-8">
                    <h4 className="text-2xl">STAKE</h4>
                    <p>
                        Stake your NFT to be cast in animated episodes, manga,
                        commercials and more! Additionally, you'll earn $SHOW
                        that can be used to claim digital assets within the
                        ecosystem.
                    </p>
                    <Link
                        className="block text-xs text-gray-1 transition-colors hover:text-tinted-white focus:text-tinted-white"
                        href="/faqs"
                    >
                        More information in FAQs →
                    </Link>
                </article>
                <article className="space-y-2 md:space-y-4 md:pr-8">
                    <h4 className="text-2xl">BURN</h4>
                    <p>
                        Buy a DeadTicket to burn your Deadhead into ashes which
                        are stored in a special NFT vessel. Open the vessel and
                        your DeadHead will rise from ashes and become a
                        HaloHead.
                    </p>
                    <Link
                        className="block text-xs text-gray-1 transition-colors hover:text-tinted-white focus:text-tinted-white"
                        href="/faqs"
                    >
                        More information in FAQs →
                    </Link>
                </article>
            </div>
        </Collapsible>
    )
}
