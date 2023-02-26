import React, {
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import Web3Modal, { ICoreOptions } from 'web3modal'

import UAuthSPA from '@uauth/js'

import { NETWORK_ID as CHAIN_ID } from 'config/constants'
import { toast } from 'react-toastify'
import Web3 from 'web3'

const UAuthWeb3Modal = require('@uauth/web3modal')

const CHAINS = {
    1: 'Ethereum Mainnet',
    4: 'Rinkeby Test Chain',
}
interface Web3ConnectionContextValue {
    connect: () => void
    disconnect: () => void

    connected: boolean
    loading: boolean
    error?: Error

    provider?: number

    account?: string
    domain?: string
    chainId?: number

    web3: Web3 | undefined
}

const Web3ConnectionContext: React.Context<Web3ConnectionContextValue> =
    React.createContext<Web3ConnectionContextValue>(null as any)

interface Web3ConnectionProviderProps extends Partial<ICoreOptions> {
    children: ReactNode
}

export function Web3ConnectionProvider({
    children,
    ...options
}: Web3ConnectionProviderProps) {
    const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
    const [uauth, setUauth] = useState<UAuthSPA>()

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()

    const [provider, setProvider] = useState<any>()

    const [account, setAccount] = useState<string>()
    const [domain, setDomain] = useState<string>()
    const [chainId, setChainId] = useState<number>()

    const [web3, setWeb3] = useState<Web3>()

    const connect = useCallback(async () => {
        if (!web3Modal) return

        try {
            setLoading(true)
            setError(undefined)

            const provider = await web3Modal.connect()
            const web3 = new Web3(provider)

            const chainId = await web3!.eth.getChainId()
            if (chainId !== CHAIN_ID) {
                const chain = CHAINS[CHAIN_ID]
                setError(
                    new Error(
                        `The selected chain is invalid. Please select ${chain} and try again.`
                    )
                )
                if (web3Modal.cachedProvider === 'custom-uauth') {
                    await uauth!.logout()
                }

                web3Modal.clearCachedProvider()
                return
            }
            setChainId(chainId)

            onAccountsChanged(await web3.eth.getAccounts())

            setProvider(provider)

            if (web3Modal.cachedProvider === 'custom-uauth') {
                const user = await uauth!.user()
                setDomain(user.sub)
            }

            setWeb3(web3)
        } catch (ex) {
            const msg = (ex as any)['message'] || ex + ''
            if (
                ![
                    'Modal closed by user', // Close web3 modal
                    'User Rejected', // Cancel on metamask
                    'User denied account authorization', // Cancel on WalletLink
                    'The popup was closed.', // Close uauth pop
                ].includes(msg)
            ) {
                setError(msg)
                // throw ex
            }
        } finally {
            setLoading(false)
        }
    }, [web3Modal])

    const disconnect = useCallback(async () => {
        if (!web3Modal) return

        if (web3Modal.cachedProvider === 'custom-uauth') {
            await uauth!.logout()
        }

        web3Modal.clearCachedProvider()

        unsubscribeFromProvider(provider)
        setProvider(undefined)

        setAccount(undefined)
        setChainId(undefined)

        setWeb3(undefined)
    }, [web3Modal, provider])

    const onDisconnect = useCallback(() => {
        setProvider(undefined)

        setChainId(undefined)
        setAccount(undefined)

        setWeb3(undefined)
    }, [])

    const onChainChanged = useCallback(
        (chainId) => {
            if (chainId == CHAIN_ID) {
                setChainId(chainId)
                setError(undefined)
            } else {
                setChainId(undefined)

                const chain = CHAINS[CHAIN_ID]
                setError(
                    new Error(
                        `The selected chain is invalid. Please select ${chain} and try again.`
                    )
                )
                disconnect()
            }
        },
        [disconnect]
    )

    const onAccountsChanged = useCallback((accounts) => {
        if (accounts.length) {
            setAccount(accounts[0])
        } else {
            setAccount(undefined)
        }
    }, [])

    const subscribeToProvider = useCallback(
        async (provider: any) => {
            if (provider == null || typeof provider.on !== 'function') {
                return
            }

            provider.on('disconnect', onDisconnect)
            provider.on('accountsChanged', onAccountsChanged)
            provider.on('chainChanged', onChainChanged)
        },
        [onChainChanged]
    )

    const unsubscribeFromProvider = useCallback(
        (provider: any) => {
            if (
                provider == null ||
                typeof provider.removeListener !== 'function'
            ) {
                return
            }

            provider.removeListener('disconnect', onDisconnect)
            provider.removeListener('accountsChanged', onAccountsChanged)
            provider.removeListener('chainChanged', onChainChanged)
        },
        [onChainChanged]
    )

    useEffect(() => {
        const w3m = new Web3Modal(options)
        setWeb3Modal(w3m)
        UAuthWeb3Modal.registerWeb3Modal(w3m)

        const { package: uauthPackage, options: uauthOptions } =
            options.providerOptions!['custom-uauth']
        setUauth(UAuthWeb3Modal.getUAuth(uauthPackage, uauthOptions))
    }, [])

    useEffect(() => {
        web3Modal && web3Modal.cachedProvider && connect()
    }, [web3Modal])

    useEffect(() => {
        subscribeToProvider(provider)
    }, [provider, subscribeToProvider])

    useEffect(() => {
        error && toast.error(error + '')
        return () => toast.dismiss()
    }, [error])
    return (
        <Web3ConnectionContext.Provider
            value={{
                connect,
                disconnect,

                connected: provider != null && account != null && web3 != null,
                loading,
                error,

                provider,

                account,
                domain,
                chainId,

                web3,
            }}
            children={children}
        />
    )
}

export const useWeb3Connection = (): Web3ConnectionContextValue => {
    const context = useContext<Web3ConnectionContextValue>(
        Web3ConnectionContext
    )
    return context
}
