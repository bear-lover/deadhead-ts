import { MobileMenuToggleProvider } from 'providers/MobileMenuToggleProvider'
import { Web3ConnectionProvider } from './Web3ConnectionProvider'
import providerOptions from 'config/web3ProviderOptions'
import TokenProviders from './token'

export default function ({ children }) {
    return (
        <Web3ConnectionProvider
            cacheProvider={true}
            theme="dark"
            providerOptions={providerOptions}
        >
            <TokenProviders>
                <MobileMenuToggleProvider>{children}</MobileMenuToggleProvider>
            </TokenProviders>
        </Web3ConnectionProvider>
    )
}
