import BigNumber from 'bignumber.js'

export enum DataSource {
    MORALIS = 'moralis',
    OPENSEA = 'opensea',
    ONCHAIN = 'onchain',
}

export interface Token {
    id: string
    name: string
    image: string
    url: string
    video?: string
    staked?: boolean
}

export enum TokenType {
    NONE = '',
    DEADHEADS = 'deadHeads',
    SKULLTROOPERS = 'skullTroopers',
    HALOHEADS = 'haloHeads',
    DEADTICKETS = 'deadTickets',
    VESSELS = 'vessels',
    GREENROOM = 'greenroom',
    GREENROOM_V2 = 'greenroomV2',
    STAKED_DEADHEADS = 'staked-deadHeads',
    STAKED_SKULLTROOPERS = 'staked-skullTroopers',
    STAKED_HALOHEADS = 'staked-haloHeads',
}

export enum StakeVersion {
    VERSION_1 = 1,
    VERSION_2 = 2,
}
export interface TokenStakedInfo {
    id: string
    version: StakeVersion
    stakedAt: number
    endsAt: number
    monthlyRewards: number
    months: number
    unclaimedRewards: BigNumber
    releasable: boolean
}

export interface TypedToken extends Token {
    type: TokenType
}
export interface StakedTypedToken extends TypedToken {
    stakedInfo: TokenStakedInfo
}

export interface Asset extends Token {
    contractAddress: string
}

export interface GreenroomV2Item {
    id: string
    name: string
    mediaType: string
    image: string
    video?: string
    maxSupply: number
    mintLimit: number
    totalSupply: number
    owner: string
    price: string
    purchaseType: number
    description: string
    active: boolean
}

export enum GreenroomV2PurchaseType {
    ETH = 0,
    SHOW = 1,
}

export interface GreenroomToken extends TypedToken {
    balance: number
}

export interface TransactionOptions {
    from: string
    gas?: number
    value?: string
}

export enum TransactionResult {
    SUCCESS = 'success',
    FAIL = 'fail',
}
