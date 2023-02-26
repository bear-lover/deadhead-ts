import { SearchBar } from './SearchBar'
import moment from 'moment-timezone'
import Accordion from '../../shared/Accordion'
import { sortKeyWords } from '../../../utils/string.util'

function InfoArticle({ title, children }) {
    return (
        <article className="break-words bg-dull-gray p-6">
            <h3 className="mb-3 font-inter text-xs font-bold normal-case">
                {title}
            </h3>
            {children}
        </article>
    )
}

export default function LeaderboardSideBar({ search, setSearch, project }) {
    const {
        description: desc,
        endDate,
        startDate,
        rewardTiers: tiers,
        keywordsIncluding,
    } = project
    const mappedKeywords = Array.from(
        sortKeyWords(keywordsIncluding.split(', ')).entries()
    )
    const isBeforeStart = moment().isBefore(moment(startDate))
    const articles = [
        {
            title: 'Description',
            info: (
                <p className="text-sm">
                    {desc || 'No description added yet.'}
                    <span className="mt-4 block text-xs">
                        Note: Spam will be filtered out and anyone attempting to
                        manipulate the system will be removed without notice.
                    </span>
                </p>
            ),
        },
        {
            title: `${isBeforeStart ? 'Start' : 'End'} Date & Time`,
            info: (
                <p className="whitespace-pre-wrap">
                    {moment
                        .tz(
                            isBeforeStart ? startDate : endDate,
                            moment.tz.guess()
                        )
                        .format('dddd Do MMMM[\n]HH:mm z')}
                </p>
            ),
        },
        {
            title: 'Rewards',
            info: (
                <div className="space-y-3 md:space-y-5">
                    {(tiers?.length &&
                        tiers?.map((tier, i, arr) => {
                            const begin = (i && +arr[i - 1].last) + 1
                            const ranks =
                                begin +
                                (begin == tier.last ? '' : '-' + tier.last)
                            return (
                                <div key={`reward-${ranks}`}>
                                    <h6 className="mb-0.5 font-inter text-[11px] normal-case">{`Rank ${ranks}`}</h6>
                                    <p className="text-lg font-light">
                                        {tier.reward}
                                    </p>
                                </div>
                            )
                        })) ||
                        'No rewards added.'}
                </div>
            ),
        },
        {
            title: 'Filters',
            info: (
                <div className="space-y-3 md:space-y-5">
                    {mappedKeywords.map((entry: any) => {
                        const [k, v] = entry
                        return (
                            <div
                                className={`overflow-hidden ${
                                    v?.length ? '' : 'hidden'
                                }`}
                                key={k}
                            >
                                <h6 className="mb-0.5 font-inter text-[11px] normal-case">
                                    {k}
                                </h6>
                                <p className="font-light">{v.join(', ')}</p>
                            </div>
                        )
                    })}
                </div>
            ),
        },
    ]
    return (
        <section className="mb-10 text-tinted-white">
            <SearchBar
                id="search handle bar"
                placeholder="Search Twitter Handle"
                search={search}
                setSearch={setSearch}
            />
            <div className="md:hidden">
                <Accordion splitted={false} items={articles} />
            </div>
            <div className="hidden space-y-5 md:block">
                {articles.map(({ title, info }, i) => (
                    <InfoArticle title={title} key={`article-${i}`}>
                        {info}
                    </InfoArticle>
                ))}
            </div>
        </section>
    )
}
