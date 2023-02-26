import { TokenType } from 'config/types'

const CATEGORIES: [TokenType, string][] = [
    [TokenType.NONE, 'All'],
    [TokenType.DEADHEADS, 'DeadHeads'],
    [TokenType.SKULLTROOPERS, 'SkullTroopers'],
    [TokenType.HALOHEADS, 'HaloHeads'],
    [TokenType.DEADTICKETS, 'DeadTickets'],
    [TokenType.VESSELS, 'Vessels'],
    [TokenType.GREENROOM, 'Green Room'],
]

enum SubTypes {
    NONE = '',
    STAKED = 'staked',
    NOSTAKED = 'nostaked',
}
const SUB_CATEGORIES: [string, string][] = [
    [SubTypes.NONE, 'All'],
    [SubTypes.STAKED, 'Staked'],
    [SubTypes.NOSTAKED, 'Not Staked'],
]

function isStakeable(type: TokenType) {
    return [
        TokenType.DEADHEADS,
        TokenType.SKULLTROOPERS,
        TokenType.HALOHEADS,
        '',
    ].includes(type)
}

export default function ({ setType, type, setSubType, subType }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2 lg:justify-end">
                {CATEGORIES.map(([_type, title], i) => (
                    <button
                        key={`my-collection-filter-item-${i}`}
                        className={`flex items-center text-[12px] font-semibold uppercase transition ${
                            _type === type
                                ? 'text-tinted-white underline'
                                : 'text-gray-1 hover:text-tinted-white hover:underline focus:text-tinted-white focus:underline'
                        }`}
                        onClick={() => {
                            setType(_type)
                            if (!isStakeable(_type)) {
                                setSubType(SubTypes.NONE)
                            }
                        }}
                    >
                        {title}
                    </button>
                ))}
            </div>
            <div className="flex gap-x-4 gap-y-2 lg:justify-end">
                {SUB_CATEGORIES.map(([_subType, title], i) => (
                    <button
                        key={`my-collection-filter-item-${i}`}
                        className={`flex items-center text-[12px] font-semibold uppercase transition ${
                            _subType === subType
                                ? 'text-tinted-white underline'
                                : 'text-gray-1 hover:text-tinted-white hover:underline focus:text-tinted-white focus:underline disabled:text-gray-1/50 disabled:no-underline'
                        }`}
                        disabled={!isStakeable(type)}
                        onClick={() => setSubType(_subType)}
                    >
                        {title}
                    </button>
                ))}
            </div>
        </div>
    )
}
