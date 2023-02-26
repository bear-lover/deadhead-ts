import { LoadMoreList } from './LoadMoreList'
import BackupImage from '../../shared/BackupImage'

export default function ScoreList({ users, gaps, totalCount }) {
    return (
        <section className="flex flex-col">
            <LoadMoreList
                items={users}
                start={200}
                load={100}
                placeholder={
                    <div className="max-w-xl">
                        {totalCount > 0 ? (
                            <>
                                <h2 className="mb-2 text-4xl">
                                    Not Found
                                </h2>
                                <p className="text-xl">
                                    Unfortunately the twitter handle isn't
                                    ranked in the leaderboard yet!
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="mb-2 text-4xl">
                                    FYI
                                </h2>
                                <p className="text-xl">
                                    The scores are calculated after 1 hr of
                                    being live.
                                </p>
                            </>
                        )}
                    </div>
                }
                renderItems={(userScore, i) => {
                    const {
                        rank,
                        score,
                        author: { username, name, profileImageUrl },
                    } = userScore
                    return (
                        <div
                            className={
                                'border-gray-2 flex py-4 items-center border-b bg-dull-gray px-2 text-sm md:px-7 ' +
                                (gaps.includes(i) ? 'mt-6' : '')
                            }
                            key={`leaderboard-user-${i}`}
                        >
                            <p className="mr-3">{rank}</p>
                            <div className="mx-3 flex items-center">
                                <BackupImage
                                    className="rounded-full"
                                    src={profileImageUrl}
                                    width={32}
                                    backup="/images/default-profile.png"
                                />
                            </div>
                            <p className="mr-1 truncate" title={name}>
                                @{username}
                            </p>
                            <p className="ml-auto md:inline-block">{score}</p>
                        </div>
                    )
                }}
            />
        </section>
    )
}
