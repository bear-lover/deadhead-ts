// For building on vercel: https://github.com/Automattic/node-canvas/issues/1779
if (
    process.env.LD_LIBRARY_PATH == null ||
    !process.env.LD_LIBRARY_PATH.includes(
        `${process.env.PWD}/node_modules/canvas/build/Release:`
    )
) {
    process.env.LD_LIBRARY_PATH = `${
        process.env.PWD
    }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`
}

/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    env: {
        BASE_URL: process.env.BASE_URL || 'http://localhost:3000',

        DISCORD_URL: process.env.DISCORD_URL || '',
        YOUTUBE_URL: process.env.YOUTUBE_URL || '',
        TWITTER_URL: process.env.TWITTER_URL || '',
        OPENSEA_URL: process.env.OPENSEA_URL || '',
        SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || '',

        NETWORK_ID: process.env.NETWORK_ID || '',

        DEADHEADS_CONTRACT_ADDRESS:
            process.env.DEADHEADS_CONTRACT_ADDRESS || '',
        SKULLTROOPERS_CONTRACT_ADDRESS:
            process.env.SKULLTROOPERS_CONTRACT_ADDRESS || '',
        STAKE_V1_CONTRACT_ADDRESS: process.env.STAKE_V1_CONTRACT_ADDRESS || '',
        STAKE_V2_CONTRACT_ADDRESS: process.env.STAKE_V2_CONTRACT_ADDRESS || '',

        SEASON_ONE_CONTRACT_ADDRESS:
            process.env.SEASON_ONE_CONTRACT_ADDRESS || '',
        DEADTICKETS_CONTRACT_ADDRESS:
            process.env.DEADTICKETS_CONTRACT_ADDRESS || '',
        VESSEL_CONTRACT_ADDRESS: process.env.VESSEL_CONTRACT_ADDRESS || '',
        HALOHEADS_CONTRACT_ADDRESS:
            process.env.HALOHEADS_CONTRACT_ADDRESS || '',

        MAX_TICKET_ID: process.env.MAX_TICKET_ID || '',

        API_ENDPOINT: process.env.API_ENDPOINT || '',

        GREENROOM_V2_CONTRACT_ADDRESS: process.env.GREENROOM_V2_CONTRACT_ADDRESS || '',
        GREENROOM_V2_API_ENDPOINT: process.env.GREENROOM_V2_API_ENDPOINT || '',

        NIP_API_ENDPOINT: process.env.NIP_API_ENDPOINT || '',
        NIP_PROJECT_SLUG: process.env.NIP_PROJECT_SLUG || '',

        OPENSEA_API_KEY: process.env.OPENSEA_API_KEY || '',
        OPENSEA_ASSET_URL: process.env.OPENSEA_ASSET_URL || '',
        OPENSEA_API_URL: process.env.OPENSEA_API_URL || '',

        UD_CLIENT_ID: process.env.UD_CLIENT_ID || '',
        UD_REDIRECT_URI: process.env.UD_REDIRECT_URI || '',

        PINATA_GATEWAY: process.env.PINATA_GATEWAY || '',

        DEADHEADS_COLLECTION_URL: process.env.DEADHEADS_COLLECTION_URL || '',
        SKULLTROOPERS_COLLECTION_URL:
            process.env.SKULLTROOPERS_COLLECTION_URL || '',
        HALOHEADS_COLLECTION_URL: process.env.HALOHEADS_COLLECTION_URL || '',
        GREENROOM_COLLECTION_URL: process.env.GREENROOM_COLLECTION_URL || '',

        DEADHEADS_HEROS: process.env.DEADHEADS_HEROS || '',
        SKULLTROOPERS_HEROS: process.env.SKULLTROOPERS_HEROS || '',
        HALOHEADS_HEROS: process.env.HALOHEADS_HEROS || '',
        GREENROOM_HEROS: process.env.GREENROOM_HEROS || '',
        GREENROOM_V2_HEROS: process.env.GREENROOM_V2_HEROS || '',

        SHOWBIZ_TOKEN_ADDRESS: process.env.SHOWBIZ_TOKEN_ADDRESS || '',
    },
    webpack: (config) => {
        config.resolve = {
            ...config.resolve,
            fallback: {
                fs: false,
                path: false,
                os: false,
            },
        }
        return config
    },
    images: {
        domains: ['arweave.net', 'lh3.googleusercontent.com', 'lh3.googleusercontent.com', 'ipfs.io', 'opensea.mypinata.cloud', 'pbs.twimg.com', 'abs.twimg.com', process.env.PINATA_GATEWAY, 'i.seadn.io'],
    },
}
