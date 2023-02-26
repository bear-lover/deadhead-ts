import BigNumber from 'bignumber.js'
import { DataSource, TokenType } from './types'

export const BASE_URL = process.env.BASE_URL || ''

export const DISCORD_URL = process.env.DISCORD_URL || ''
export const YOUTUBE_URL = process.env.YOUTUBE_URL || ''
export const TWITTER_URL = process.env.TWITTER_URL || ''
export const OPENSEA_URL = process.env.OPENSEA_URL || ''

export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || ''

export const NETWORK_ID =
    process.env.NETWORK_ID && !isNaN(parseInt(process.env.NETWORK_ID))
        ? parseInt(process.env.NETWORK_ID)
        : 1
export const INFURA_ID = process.env.INFURA_ID || ''

export const DEADHEADS_CONTRACT_ADDRESS =
    process.env.DEADHEADS_CONTRACT_ADDRESS || ''
export const SKULLTROOPERS_CONTRACT_ADDRESS =
    process.env.SKULLTROOPERS_CONTRACT_ADDRESS || ''
export const STAKE_V1_CONTRACT_ADDRESS =
    process.env.STAKE_V1_CONTRACT_ADDRESS || ''
export const STAKE_V2_CONTRACT_ADDRESS =
    process.env.STAKE_V2_CONTRACT_ADDRESS || ''

export const SEASON_ONE_CONTRACT_ADDRESS =
    process.env.SEASON_ONE_CONTRACT_ADDRESS || ''
export const DEADTICKETS_CONTRACT_ADDRESS =
    process.env.DEADTICKETS_CONTRACT_ADDRESS || ''
export const VESSEL_CONTRACT_ADDRESS = process.env.VESSEL_CONTRACT_ADDRESS || ''
export const HALOHEADS_CONTRACT_ADDRESS =
    process.env.HALOHEADS_CONTRACT_ADDRESS || ''

export const MAX_TICKET_ID =
    process.env.MAX_TICKET_ID && !isNaN(parseInt(process.env.MAX_TICKET_ID))
        ? parseInt(process.env.MAX_TICKET_ID)
        : 10000

export const API_ENDPOINT =
    process.env.API_ENDPOINT || 'https://api-dh.collection.tools'

export const NIP_API_ENDPOINT = process.env.NIP_API_ENDPOINT || ''
export const NIP_PROJECT_SLUG = process.env.NIP_PROJECT_SLUG || ''

export const GREENROOM_V2_CONTRACT_ADDRESS =
    process.env.GREENROOM_V2_CONTRACT_ADDRESS || ''
export const GREENROOM_V2_API_ENDPOINT =
    process.env.GREENROOM_V2_API_ENDPOINT || ''

export const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || ''
export const OPENSEA_ASSET_URL =
    process.env.OPENSEA_ASSET_URL || 'https://opensea.io/assets'
export const OPENSEA_API_URL =
    process.env.OPENSEA_API_URL || 'https://api.opensea.io/api/v1'

export const UD_CLIENT_ID = process.env.UD_CLIENT_ID || ''
export const UD_REDIRECT_URI = process.env.UD_REDIRECT_URI || ''

export const PINATA_GATEWAY = process.env.PINATA_GATEWAY || 'ipfs.io'

export const DEADHEADS_COLLECTION_URL =
    process.env.DEADHEADS_COLLECTION_URL || ''
export const SKULLTROOPERS_COLLECTION_URL =
    process.env.SKULLTROOPERS_COLLECTION_URL || ''
export const HALOHEADS_COLLECTION_URL =
    process.env.HALOHEADS_COLLECTION_URL || ''
export const GREENROOM_COLLECTION_URL =
    process.env.GREENROOM_COLLECTION_URL || ''

export const DEADHEADS_HEROS = process.env.DEADHEADS_HEROS
    ? process.env.DEADHEADS_HEROS.split(/\s*,\s*/)
    : []
export const SKULLTROOPERS_HEROS = process.env.SKULLTROOPERS_HEROS
    ? process.env.SKULLTROOPERS_HEROS.split(/\s*,\s*/)
    : []
export const HALOHEADS_HEROS = process.env.HALOHEADS_HEROS
    ? process.env.HALOHEADS_HEROS.split(/\s*,\s*/)
    : []
export const GREENROOM_HEROS = process.env.GREENROOM_HEROS
    ? process.env.GREENROOM_HEROS.split(/\s*,\s*/)
    : []

export const GREENROOM_V2_HEROS = process.env.GREENROOM_V2_HEROS
    ? process.env.GREENROOM_V2_HEROS.split(/\s*,\s*/)
    : []

export const SHOWBIZ_TOKEN_ADDRESS = process.env.SHOWBIZ_TOKEN_ADDRESS || ''

export const HEAD_TYPES = [
    'human',
    'skeleton',
    'mummy',
    'zombie',
    'ghost',
    'gold',
]

export const WALLET_SIGN_MESSAGE =
    "Hi there! Sign this message to prove you have access to this wallet. This won't cost you any Ether."

export const MAIN_DATA_SOURCE = DataSource.MORALIS

const stakeOptions = [
    [3, 8000],
    [6, 24000],
    [12, 48000],
    [24, 80000],
]

export const STAKE_PERIODS = stakeOptions.map(([month]) => month)
export const MONTHLY_REWWARDS = {}
stakeOptions.forEach(([month, rewards]) => {
    MONTHLY_REWWARDS[month] = rewards
})

const PFP_DOWNLOAD_OPTIONS: [string | string[], string[]][] = [
    [
        [TokenType.DEADHEADS, TokenType.STAKED_DEADHEADS],
        [
            'https://deadheads-2d-pfps.s3.us-west-2.amazonaws.com/v1/{ID}.png',
            'https://deadheads-3d-files.s3.us-west-2.amazonaws.com/fbx-hq-full/{ID}.fbx',
            'https://deadheads-3d-files.s3.us-west-2.amazonaws.com/fbx-hq-dh-only/{ID}.fbx',
        ],
    ],
]

export const PFP_DOWNLOADABLE_TYPES = PFP_DOWNLOAD_OPTIONS.reduce<string[]>(
    (allTypes, [types]) => [
        ...allTypes,
        ...(Array.isArray(types) ? types : [types]),
    ],
    []
)
export const PFP_DOWNLOAD_LINKS = {}
PFP_DOWNLOAD_OPTIONS.forEach(([types, links]) => {
    if (Array.isArray(types)) {
        types.forEach((type) => {
            PFP_DOWNLOAD_LINKS[type] = links
        })
    } else {
        PFP_DOWNLOAD_LINKS[types] = links
    }
})

export const MAX_ALLOWANCE = new BigNumber(2).pow(256).minus(1).toFixed(0)
