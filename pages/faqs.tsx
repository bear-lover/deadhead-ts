import FAQs from '../components/faq/components/FAQs'

export default function () {
    const itemsDeadHeads = [
        {
            title: 'What the hell is an NFT?',
            info: 'A commodity that is ‘fungible’ is something that can be exchanged for the same value, and is completely interchangeable.\n\nThe most common example of this is money.\n\nFor instance, $20 bills are fungible - they can be swapped for another $20 and you wouldn’t notice the difference, or you could swap them for 2 x $10.\n\nWhichever way you exchange them, it makes no difference - the value is the same, meaning you essentially have the same commodity. You still have $20, regardless of how you try to cut it.\n\nSo, something that is non fungible is something which cannot be exchanged or interchanged with anything of the same value - as there is nothing exactly like it.\n\nIn this sense, a non-fungible commodity can be assigned value and bought, but as it is completely unique, it is non interchangeable for anything else like itself.',
        },
        {
            title: 'How do I buy one?',
            info: (
                <>
                    NFTs are commonly traded on marketplaces such as Opensea.io
                    or aggregators of marketplaces like{' '}
                    <a
                        className="text-tinted-white hover:underline"
                        href="https://gem.xyz"
                    >
                        Gem.xyz
                    </a>
                    .{'\n\n'}Deadheads NFTs can be found using the Official
                    Links in{' '}
                    <a
                        className="text-tinted-white hover:underline"
                        href="https://Discord.gg/DeadHeads"
                    >
                        Discord.gg/DeadHeads
                    </a>
                    . We recommend one of the following: {'\n\n'}
                    <a
                        className="break-all text-tinted-white hover:underline"
                        href="https://opensea.io/collection/deadheads"
                    >
                        https://opensea.io/collection/deadheads
                    </a>
                    {'\n\n'}
                    <a
                        className="break-all text-tinted-white hover:underline"
                        href="https://opensea.io/collection/haloheads-nft"
                    >
                        https://opensea.io/collection/haloheads-nft
                    </a>
                    {'\n\n'}
                    <a
                        className="break-all text-tinted-white hover:underline"
                        href="https://opensea.io/collection/deadheads-skull-troopers"
                    >
                        https://opensea.io/collection/deadheads-skull-troopers
                    </a>
                    .
                </>
            ),
        },
        {
            title: 'How much does it cost?',
            info: 'The price of an NFT will vary depending on what the market decides to price them at, each individual one will have a unique price.',
        },
        {
            title: 'Do I need to buy a Deadhead to be a part of the community?',
            info: 'Yes, or a Skull Trooper or a Halo Head. DeadHeads is a franchise containing many varying assets.',
        },
    ]
    const itemsShow = [
        {
            title: 'What is $SHOW?!!',
            info: '$SHOW is the official token used within the DeadHeads ecosystem. These utility tokens are used to collect exclusive digital assets from our Green Room, access unique benefits, and more. With gas prices so high on ETH, adding an ERC-20 token will massively reduce transaction fees for our holders.',
        },
        {
            title: 'What are the tokenomics?',
            info: '- ERC-20 token on ethereum mainnet.\n\n- No max supply. This is not a currency, this is a utility token only to be used within the DeadHeads ecosystem.\n\n- Any tokens spent are burned from supply.',
        },
        {
            title: 'How Do I Earn $SHOW?',
            info: 'Tokens can only be earned by staking your DeadHead characters (DH, Skull Troopers, Evolved DHs) into our casting pool. No, you cannot stake a vessel/urn. This locks up your NFT for a period of time and gives it a chance to be featured in our content! The longer you stake, the bigger the rewards. Bonus $SHOW will also sometimes be given out on special occasions as rewards.',
        },
        {
            title: 'How Do I Claim My $SHOW From Staking?',
            info: 'When staking your NFT, you will accumulate $SHOW weekly. At any time, you can see how much has been earned, and claim your $SHOW. This will put the earned amount into your digital wallet for you to own and use freely. Note: $SHOW is accumulated. To save on gas, you can wait to claim your tokens and continue to accumulate.',
        },
        {
            title: 'When can I spend $SHOW?',
            info: 'Starting Season 2 (and maybe earlier), all Green Room assets will only be purchasable using $SHOW and $ETH. Other future events/functionality may also require $SHOW.',
        },
        {
            title: 'What happens to the $SHOW I spend?',
            info: 'All $SHOW used will be burned from supply.',
        },
        {
            title: 'What about DeadTickets?',
            info: 'If you hold a DeadTicket after season 1, you will be able to trade in your DeadTicket for a proportionate amount of $SHOW.',
        },
    ]
    const itemsGreenroom = [
        {
            title: 'What are DeadTickets?',
            info: (
                <>
                    The Green Room is only opened up for holders of "Dead
                    Tickets". These Dead Tickets are queued mint passes with a
                    1-time use and allow people to access the Green Room and
                    mint assets. The assets themselves are free (plus a small
                    gas fee), but minting an asset will BURN 1 or more of your
                    Dead Tickets. The number of Dead Tickets required to mint an
                    asset varies depending on the rarity of the asset itself.
                    These burned tickets are removed forever from your wallet,
                    and the lower numbered ticket will always be burned first.
                    So choose wisely how you spend them!{' '}
                    <a
                        className="text-tinted-white hover:underline"
                        href="https://opensea.io/collection/deadtickets"
                    >
                        https://opensea.io/collection/deadtickets
                    </a>
                    .
                </>
            ),
        },
        {
            title: 'What is the Greenroom?',
            info: (
                <p>
                    An innovative piece of technology that allows people to
                    collect rare assets from the animated series. After every
                    episode, the Green Room is opened up, revealing limited
                    edition items available for people to collect. These items
                    vary in rarities, and are a way for people to collect pieces
                    of history from the show. Some assets might play an
                    important part later on in the series, and some might only
                    be seen in that one episode. That’s the fun of it all!{' '}
                    <a
                        className="text-tinted-white hover:underline"
                        href="https://app.deadheads.io/"
                    >
                        https://app.deadheads.io/
                    </a>
                    .
                </p>
            ),
        },
    ]
    const itemsEpisodes = [
        {
            title: 'When’s the next episode?',
            info: (
                <p>
                    We strive to have a new episode ready every 2-3 weeks.
                    Depending on the complexity of each episode this timeframe
                    could shift.{'\n\n'}
                    <a
                        className="break-all text-tinted-white hover:underline"
                        href="https://www.youtube.com/channel/UCLAbt0FzUCe5BRAtMM40Ikg"
                    >
                        https://www.youtube.com/channel/UCLAbt0FzUCe5BRAtMM40Ikg
                    </a>
                    .
                </p>
            ),
        },
    ]
    const itemsMiscellaneous = [
        {
            title: 'Can I exchange DeadHeads merchandise for a different size?',
            info: 'Unfortunately all merchandise sent is final, we will not be able to take returns or trades for different sizes.',
        },
    ]
    const itemsProperty = [
        {
            title: 'Do I retain IP ownership of a DeadHead that I burned for an Evolved DeadHead?',
            info: 'Unfortunately no you do not. The DeadHead that has burned is not in your ownership anymore. You will have IP ownership of your Evolved DeadHead.',
        },
    ]
    const sections = [
        {
            heading: 'DeadHeads NFTs',
            items: itemsDeadHeads,
        },
        {
            heading: 'Show Tokens',
            items: itemsShow,
        },
        {
            heading: 'DeadTickets & Green Room',
            items: itemsGreenroom,
        },
        {
            heading: 'Episodes',
            items: itemsEpisodes,
        },
        {
            heading: 'Miscellaneous',
            items: itemsMiscellaneous,
        },
        {
            heading: 'Intellectual property',
            items: itemsProperty,
        },
    ]

    return <FAQs sections={sections} />
}
