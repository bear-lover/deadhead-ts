import DeadHeadsShelf from './components/DeadHeadsShelf'
import SkullTroopersShelf from './components/SkullTroopersShelf'
import HaloHeadsShelf from './components/HaloHeadsShelf'
import GreenroomShelf from './components/GreenroomShelf'
import { SEASON_ONE_CONTRACT_ADDRESS } from 'config/constants'
import { useWeb3Connection } from 'providers/Web3ConnectionProvider'
import AccountShelf from './components/AccountShelf'
import Welcome from './components/Welcome'

export default function () {
    const { connected } = useWeb3Connection()

    return (
        <div className="grid w-full grid-cols-1 gap-4 md:gap-6">
            {connected ? <AccountShelf /> : <Welcome />}
            <DeadHeadsShelf />
            <SkullTroopersShelf />
            <HaloHeadsShelf />
            {SEASON_ONE_CONTRACT_ADDRESS && <GreenroomShelf />}
        </div>
    )
}
