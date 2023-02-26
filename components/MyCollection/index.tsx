import Information from './components/Information'
import StakedAssetCard from './components/cards/StakedAssetCard'
import VesselCard from './components/cards/VesselCard'
import AssetCard from './components/cards/AssetCard'
import GreenroomCard from './components/cards/GreenroomCard'
import Filter from './components/Filter'
import Actions from './components/Actions'
import { useAccount } from 'providers/token/AccountProvider'
import { TokenType, StakedTypedToken, GreenroomToken } from 'config/types'
import { useCallback, useMemo, useState } from 'react'
import { RefreshIcon } from '@heroicons/react/outline'
import Providers from './Providers'
import PlaceholderCard from './components/cards/PlaceholderCard'
import GenericAssetCard from './components/cards/GenericAssetCard'
import { PFP_DOWNLOADABLE_TYPES } from 'config/constants'

export default function MyCollection() {
    const { tokens, loaded, loading, refresh } = useAccount()
    const [type, setType] = useState('')
    const [subType, setSubType] = useState('')

    const filter = useCallback(
        ({ type: tokenType }) => {
            switch (subType) {
                case 'staked':
                    return tokenType.startsWith(`staked-${type}`)
                case 'nostaked':
                    return (
                        (!type && !tokenType.startsWith(`staked-${type}`)) ||
                        tokenType === type
                    )
                default:
                    return tokenType.indexOf(type) > -1
            }
        },
        [type, subType]
    )
    const filteredTokens = useMemo(
        () => (type || subType ? tokens.filter(filter) : tokens),
        [type, subType, tokens]
    )

    return (
        <Providers>
            <div className="space-y-4 md:space-y-6">
                <div className="relative flex flex-col items-start justify-between gap-x-4 gap-y-4 rounded-lg bg-dark-gray p-4 md:p-6 lg:flex-row">
                    <div className="flex items-center">
                        <h2 className="flex-1 whitespace-nowrap text-[22px] md:text-[40px]">
                            My Collection
                        </h2>
                        <button
                            className={`ml-2 text-tinted-white/50 transition hover:text-tinted-white disabled:text-gray-1 md:ml-4`}
                            disabled={loading}
                            onClick={refresh}
                            title="Reload"
                        >
                            <RefreshIcon
                                className={`h-4 w-4 md:h-6 md:w-6 ${
                                    loading && 'animate-reverse-spin'
                                }`}
                            />
                        </button>
                    </div>
                    <Filter
                        setType={setType}
                        type={type}
                        setSubType={setSubType}
                        subType={subType}
                    />
                </div>
                <Information />
                <Actions />
                <div className="mt-4 grid grid-cols-1 justify-center gap-4 sm:grid-cols-2 md:mt-6 md:grid-cols-1 md:justify-start md:gap-6 xl:grid-cols-2 3xl:grid-cols-3">
                    {loaded
                        ? filteredTokens.map((token) =>
                              token.type === TokenType.DEADTICKETS ? (
                                  <GenericAssetCard
                                      key={`my-collection-token-${token.type}-${token.id}`}
                                      token={token}
                                  />
                              ) : token.type === TokenType.VESSELS ? (
                                  <VesselCard
                                      key={`my-collection-token-${token.type}-${token.id}`}
                                      token={token}
                                  />
                              ) : token.type === TokenType.GREENROOM ||
                                token.type === TokenType.GREENROOM_V2 ? (
                                  <GreenroomCard
                                      key={`my-collection-token-${token.type}-${token.id}`}
                                      token={token as GreenroomToken}
                                  />
                              ) : token.staked ? (
                                  <StakedAssetCard
                                      key={`my-collection-token-${token.type}-${token.id}`}
                                      token={token as StakedTypedToken}
                                  />
                              ) : (
                                  <AssetCard
                                      key={`my-collection-token-${token.type}-${token.id}`}
                                      token={token}
                                  />
                              )
                          )
                        : Array(12)
                              .fill(null)
                              .map((_, i) => (
                                  <PlaceholderCard
                                      key={`my-collection-tokne-skeletion-${i}`}
                                  />
                              ))}
                </div>
            </div>
        </Providers>
    )
}
