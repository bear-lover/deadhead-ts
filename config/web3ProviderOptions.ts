import { IProviderOptions } from 'web3modal'

import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'

import { INFURA_ID, UD_CLIENT_ID, UD_REDIRECT_URI } from './constants'
import UAuthSPA from '@uauth/js'
// import UAuthWeb3Modal from '@uauth/web3modal'
import { IUAuthOptions } from '@uauth/web3modal'
const UAuthWeb3Modal = require('@uauth/web3modal')

const uauthOptions: IUAuthOptions = {
    clientID: UD_CLIENT_ID,
    redirectUri: UD_REDIRECT_URI,

    scope: 'openid wallet',
}

const providerOptions: IProviderOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: INFURA_ID,
        },
    },
    'custom-walletlink': {
        display: {
            logo: '/images/wallet-link.svg',
            name: 'WalletLink',
            description: 'Scan with WalletLink to connect',
        },
        options: {
            appName: 'DeadHeads Dapp',
            networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
            chainId: process.env.NETWORK_ID,
        },
        package: WalletLink,
        connector: async (_, options) => {
            const { appName, networkUrl, chainId } = options

            const walletLink = new WalletLink({
                appName,
            })

            const provider = walletLink.makeWeb3Provider(networkUrl, chainId)

            await provider.enable()

            return provider
        },
    },

    'custom-uauth': {
        display: UAuthWeb3Modal.display,
        connector: UAuthWeb3Modal.connector,
        package: UAuthSPA,
        options: uauthOptions,
    },
}

export default providerOptions
