import { ReactNode } from 'react'
import { BurnProvider } from './components/burn/BurnProvider'
import { ClaimProvider } from './components/claim/ClaimProvider'
import { EvolveProvider } from './components/evolve/EvolveProvider'
import { ReleaseProvider } from './components/release/ReleaseProvider'
import { StakeProvider } from './components/stake/StakeProvider'
import { TypeSelectProvider } from './components/type-select/TypeSelectProvider'

interface ProvidersProps {
    children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <TypeSelectProvider>
            <StakeProvider>
                <BurnProvider>
                    <EvolveProvider>
                        <ReleaseProvider>
                            <ClaimProvider>{children}</ClaimProvider>
                        </ReleaseProvider>
                    </EvolveProvider>
                </BurnProvider>
            </StakeProvider>
        </TypeSelectProvider>
    )
}
