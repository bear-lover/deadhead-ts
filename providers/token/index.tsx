import { TransactionProvider } from 'components/transaction/TransactionProvider'
import { DeadHeadsProvider } from './DeadHeadsProvider'
import { AccountProvider } from './AccountProvider'
import { SkullTroopersProvider } from './SkullTroopersProvider'
import { DeadTicketsProvider } from './DeadTicketsProvider'
import { HaloHeadsProvider } from './HaloHeadsProvider'
import { VesselsProvider } from './VesselsProvider'
import { GreenroomProvider } from './GreenroomProvider'
import { ShowBizProvider } from './ShowBizProvider'
import { GreenroomV2Provider } from './GreenroomV2Provider'

export default function ({ children }) {
    return (
        <TransactionProvider>
            <ShowBizProvider>
                <DeadTicketsProvider>
                    <DeadHeadsProvider>
                        <SkullTroopersProvider>
                            <HaloHeadsProvider>
                                <VesselsProvider>
                                    <GreenroomProvider>
                                        <GreenroomV2Provider>
                                            <AccountProvider>
                                                {children}
                                            </AccountProvider>
                                        </GreenroomV2Provider>
                                    </GreenroomProvider>
                                </VesselsProvider>
                            </HaloHeadsProvider>
                        </SkullTroopersProvider>
                    </DeadHeadsProvider>
                </DeadTicketsProvider>
            </ShowBizProvider>
        </TransactionProvider>
    )
}
