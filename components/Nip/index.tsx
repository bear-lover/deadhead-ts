import LeaderboardSideBar from './components/LeaderboardSideBar'
import ScoreList from './components/ScoreList'
import { useCallback, useMemo, useState } from 'react'

export default function Leaderboard({ project }) {
    const [search, setSearch] = useState('')
    const authorScores = useMemo(() => project.ranks, [project])

    const filter = useCallback(
        ({ author: { name, username } }) =>
            username.toLowerCase().indexOf(search.toLowerCase()) > -1,
        [search]
    )
    const filteredAuthorScores = useMemo(
        () => (search ? authorScores.filter(filter) : authorScores),
        [authorScores, search, filter]
    )

    return (
        <div className="md:bg-dark-gray rounded-2xl md:p-8 pb-24">
            <h2 className="text-3xl hidden md:block mb-7">{project.title}</h2>
            <div className="flex flex-col-reverse md:grid md:grid-cols-5 md:space-x-10">
                <div className="md:col-span-3 bg-dark-gray md:bg-transparent rounded-2xl p-5 md:p-0">
                    <ScoreList
                        users={filteredAuthorScores}
                        gaps={project.rewardTiers?.map((tier) => +tier.last) || []}
                        totalCount={authorScores.length}
                    />
                </div>
                <div className="md:col-span-2 bg-dark-gray md:bg-transparent rounded-2xl p-5 md:p-0 mb-5 md:mb-0">
                    <h2 className="md:hidden text-2xl text-center">{project.title}</h2>
                    <LeaderboardSideBar
                        search={search}
                        setSearch={setSearch}
                        project={project}
                    />
                </div>
            </div>
        </div>
    )
}
