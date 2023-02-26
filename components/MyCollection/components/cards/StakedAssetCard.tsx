import GenericAssetCard from './GenericAssetCard'
import moment from 'moment-timezone'
import BigNumber from 'bignumber.js'
import { StakedTypedToken, StakeVersion, TokenType } from 'config/types'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { useRelease } from '../release/ReleaseProvider'
import { useCallback } from 'react'
import { PFP_DOWNLOADABLE_TYPES, PFP_DOWNLOAD_LINKS } from 'config/constants'
import PFPDownload from './PFPDownload'

const WEEK_COUNT_IN_A_MONTH = 4
const CORRECT_MONTHLY_REWARDS = [4000, 8000, 24000, 48000, 80000]
const AVAILABLE_PERIODS = [1, 3, 6, 12, 24]
function getCorrectMonthlyRewardsByMonths(months: number) {
    return CORRECT_MONTHLY_REWARDS[AVAILABLE_PERIODS.indexOf(months)]
}

function getCorrectRewards(
    incorrectRewards: BigNumber,
    incorrectMonthlyRewards: number,
    months: number
): BigNumber {
    const incorrectWeeklyRewards =
        incorrectMonthlyRewards / WEEK_COUNT_IN_A_MONTH // incorrect weekly rewards

    const weeks = incorrectRewards.div(incorrectWeeklyRewards) // the number of weeks for the rewards claimable

    const correctMonthlyRewards: number = getCorrectMonthlyRewardsByMonths(
        months /* staking months */
    )
    const correctWeeklyRewards: number =
        correctMonthlyRewards / WEEK_COUNT_IN_A_MONTH // correct weekly rewards

    return new BigNumber(correctWeeklyRewards).times(weeks)
}

function AvailableRewards({
    type,
    version,
    unclaimedRewards,
    monthlyRewards,
    months,
}) {
    if (
        type === TokenType.STAKED_DEADHEADS &&
        version === StakeVersion.VERSION_1
    ) {
        const correctRewards: BigNumber = getCorrectRewards(
            unclaimedRewards,
            monthlyRewards,
            months
        )
        return (
            (correctRewards.eq(unclaimedRewards) && (
                <span>{unclaimedRewards.integerValue().toFormat()} $SHOW</span>
            )) || (
                <span className="flex items-center">
                    <span>{unclaimedRewards.integerValue().toFormat()} $SHOW</span>
                    <span className="group relative">
                        <InformationCircleIcon className="ml-1 h-4 w-4 cursor-pointer text-orange-600" />
                        <span className="invisible absolute bottom-5 right-2 w-48 translate-x-[50%] rounded-md bg-tinted-white p-2 opacity-0 shadow transition-opacity before:absolute before:top-[100%] before:left-[50%] before:-ml-1 before:w-2 before:border-4 before:border-b-0 before:border-transparent before:border-t-tinted-white group-hover:visible group-hover:opacity-100">
                            The correct rewards are{' '}
                            <strong>{correctRewards.integerValue().toFormat()}</strong> $SHOW.{' '}
                            <br />
                            The missing rewards are airdropped regularly.
                        </span>
                    </span>
                </span>
            )
        )
    } else return <span>{unclaimedRewards.integerValue().toFormat()} $SHOW</span>
}

interface StakedAssetCardProps {
    token: StakedTypedToken
    downloadable?: boolean
}

export default function StakedAssetCard({
    token,
    downloadable = false,
}: StakedAssetCardProps) {
    const {
        setDialogOpen: setReleaseDialogOpen,
        setTokenType: setReleasingTokenType,
        setTokens: setSelectedReleasingTokens,
    } = useRelease()

    const handleReleaseClick = useCallback(() => {
        setReleasingTokenType(token.type)
        setSelectedReleasingTokens([token])
        setReleaseDialogOpen(true)
    }, [token])

    return (
        <GenericAssetCard
            token={token}
            renderOnImage={
                <>
                    {PFP_DOWNLOADABLE_TYPES.includes(token.type) && (
                        <div className="absolute top-4 left-4">
                            <PFPDownload
                                downloadLinks={PFP_DOWNLOAD_LINKS[
                                    token.type
                                ].map((link) => link.replace('{ID}', token.id))}
                            />
                        </div>
                    )}
                    <p className="absolute top-4 right-4 rounded-full bg-tinted-white py-0.5 px-2 text-[10px] font-bold text-black">
                        STAKED
                    </p>
                </>
            }
        >
            <div className="space-y-2 text-xs">
                <div className="space-y-2">
                    <p>Release Date</p>
                    <p className="text-gray-1">{`${moment(
                        token.stakedInfo.endsAt * 1000
                    ).format('l, LT')}`}</p>
                </div>

                <div className="space-y-2">
                    <p>$SHOW Rewards</p>
                    <p className="text-gray-1">
                        {token.stakedInfo.releasable
                            ? 'No more $SHOW'
                            : `${
                                  (getCorrectMonthlyRewardsByMonths(
                                      token.stakedInfo.months
                                  ) / 4).toLocaleString(undefined, {minimumFractionDigits: 2})
                              } $SHOW each ${moment(
                                  token.stakedInfo.stakedAt * 1000
                              ).format('ddd')}.`}
                    </p>
                </div>
                <div className="space-y-2">
                    <p>Available Rewards</p>
                    <p className="text-gray-1">
                        <AvailableRewards
                            type={token.type}
                            {...token.stakedInfo}
                        />
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        className={`block w-full border border-white bg-transparent py-2 text-center text-[10px] uppercase transition ease-in-out hover:bg-white hover:text-gray-1 disabled:border-gray-1 disabled:bg-transparent disabled:text-gray-1`}
                        disabled={!token.stakedInfo.releasable}
                        onClick={handleReleaseClick}
                    >
                        Release
                    </button>
                    {/* {downloadable && (
                        <button className="block w-full border border-white bg-transparent py-2 text-center text-[10px] transition ease-in-out hover:bg-white hover:text-gray-1 md:hidden">
                            2D &amp; 3D PFP
                        </button>
                    )} */}
                </div>
            </div>
        </GenericAssetCard>
    )
}
