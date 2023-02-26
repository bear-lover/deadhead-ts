import Modal from 'components/shared/Modal'
import { useCallback, useMemo } from 'react'
import { useBurn } from './BurnProvider'
import { useDeadTickets } from 'providers/token/DeadTicketsProvider'
import { useDeadHeads } from 'providers/token/DeadHeadsProvider'
import { Loader } from 'components/shared/Loader'
import SelectableTokenList from '../SelectableTokenList'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'

export default function BurnDialog() {
    const {
        dialogOpen,
        step,
        setDialogOpen,

        burning,
    } = useBurn()

    return (
        <Modal
            title="Burn Your DeadHead"
            description={`With a DeadTicket you can burn your Deadhead into ashes which are stored in a special NFT vessel. Open the vessel and your DeadHead will rise from ashes and become a HaloHead.`}
            show={dialogOpen}
            onClose={() => !burning && setDialogOpen(false)}
        >
            {step == 0 && <DeadHeadsSelectionStep />}
            {step == 1 && <DeadTicketsSelectionStep />}
        </Modal>
    )
}

function DeadHeadsSelectionStep() {
    const {
        setStep,
        deadHeads: selectedDeadHeads,
        setDeadHeads: setSelectedDeadHeads,

        agreed,
        setAgreed,

        burning,
    } = useBurn()

    const { tokens: deadHeads } = useDeadHeads()
    const { tokens: deadTickets } = useDeadTickets()

    const selectedDeadHeadIds: string[] = useMemo(
        () => selectedDeadHeads.map(({ id }) => id),
        [selectedDeadHeads]
    )

    const selectDeadHeads = useCallback(
        (token) => {
            setSelectedDeadHeads((tokens) =>
                selectedDeadHeadIds.includes(token.id)
                    ? tokens.filter(({ id }) => id != token.id)
                    : [token]
            )
        },
        [selectedDeadHeadIds]
    )

    return (
        <div>
            <div className="flex min-h-[40vh] flex-wrap gap-2 py-6 md:gap-4 md:py-8">
                <SelectableTokenList
                    tokens={deadHeads}
                    selectedTokens={selectedDeadHeads}
                    selectToken={selectDeadHeads}
                />
            </div>
            <div className="flex flex-col justify-between gap-4 rounded-xl bg-black p-4 shadow-xl shadow-black/10 md:flex-row">
                <div className="flex items-center justify-center">
                    You have
                    <span className="mx-2 w-10 rounded-md border border-tinted-white p-2 text-center">
                        {deadTickets.length}
                    </span>
                    DeadTickets to use
                </div>
                <div className="flex flex-col items-center gap-x-16 gap-y-2 md:flex-row">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2 h-5 w-5"
                            checked={agreed}
                            disabled={burning}
                            onChange={(e) => setAgreed(!agreed)}
                        />{' '}
                        License agreement
                    </label>
                    <button
                        className={`w-full rounded-md border-2 border-black bg-tinted-white px-6 py-2 font-vimland text-xl uppercase text-black ring-tinted-white hover:bg-opacity-90 focus:outline-none focus:ring disabled:bg-opacity-100 disabled:opacity-50 md:w-auto md:px-16`}
                        disabled={selectedDeadHeads.length <= 0}
                        onClick={() => setStep((step) => step + 1)}
                    >
                        {burning && (
                            <div className="mr-2">
                                <Loader />
                            </div>
                        )}
                        Next <ChevronRightIcon className="w-6" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function DeadTicketsSelectionStep() {
    const {
        setStep,
        deadTickets: selectedDeadTickets,
        setDeadTickets: setSelectedDeadTickets,

        agreed,
        setAgreed,

        burning,
        startBurning,
    } = useBurn()

    const { tokens: deadTickets } = useDeadTickets()

    const selectedDeadTicketIds: string[] = useMemo(
        () => selectedDeadTickets.map(({ id }) => id),
        [selectedDeadTickets]
    )

    const selectDeadTickets = useCallback(
        (token) => {
            setSelectedDeadTickets((tokens) =>
                selectedDeadTicketIds.includes(token.id)
                    ? tokens.filter(({ id }) => id != token.id)
                    : [token]
            )
        },
        [selectedDeadTicketIds]
    )

    return (
        <div>
            <div className="flex min-h-[40vh] flex-wrap gap-2 py-6 md:gap-4 md:py-8">
                <SelectableTokenList
                    tokens={deadTickets}
                    selectedTokens={selectedDeadTickets}
                    selectToken={selectDeadTickets}
                />
            </div>
            <div className="flex flex-col justify-between gap-4 rounded-xl bg-black p-4 shadow-xl shadow-black/10 md:flex-row">
                <button
                    className="w-full rounded-md border-2 border-black bg-tinted-white px-6 py-2 font-vimland text-xl uppercase text-black ring-tinted-white hover:bg-opacity-90 disabled:bg-opacity-100 disabled:opacity-50 md:w-auto md:px-16"
                    onClick={() => setStep((step) => step - 1)}
                >
                    <ChevronLeftIcon className="w-6" /> Back &nbsp;
                </button>
                <div className="flex flex-col items-center gap-x-16 gap-y-2 md:flex-row">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2 h-5 w-5"
                            checked={agreed}
                            disabled={burning}
                            onChange={(e) => setAgreed(!agreed)}
                        />{' '}
                        License agreement
                    </label>
                    <button
                        className={`w-full rounded-md border-2 border-black bg-tinted-white px-6 py-2 font-vimland text-xl uppercase text-black ring-tinted-white hover:bg-opacity-90 focus:outline-none focus:ring disabled:bg-opacity-100 disabled:opacity-50 md:w-auto md:px-16`}
                        disabled={
                            selectedDeadTicketIds.length <= 0 ||
                            !agreed ||
                            burning
                        }
                        onClick={startBurning}
                    >
                        {burning && (
                            <div className="mr-2">
                                <Loader />
                            </div>
                        )}
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}
