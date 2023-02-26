import Collapsible from 'components/shared/Collapsible'
import { Link } from 'components/shared/Link'

export default function Information() {
    return (
        <Collapsible title="Information">
            <div className="mt-6 md:mt-8 grid grid-col-1 md:grid-cols-2 gap-6 md:gap-8">
                <article className="space-y-2 md:space-y-4 md: pr-8">
                    <h4 className="text-2xl">MINTING</h4>
                    <p>
                        Official assets from DeadHeads media, using ETH and SHOW as payment. Limited edition NFTs are released with each production from the DeadHeads team. Stake your DeadHeads/HaloHeads/Skull Troopers and accumulate SHOW so you’re ready to mint.
                    </p>
                    <Link
                        className="block text-xs text-gray-1 transition-colors hover:text-tinted-white focus:text-tinted-white"
                        href="/faqs"
                    >
                        More information in FAQs →
                    </Link>
                </article>
                <article className="space-y-2 md:space-y-4 md:pr-8">
                    <h4 className="text-2xl">BURNT SHOW</h4>
                    <p>
                    All SHOW spent in the GreenRoom is burnt and removed from the ecosystem forever.
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
