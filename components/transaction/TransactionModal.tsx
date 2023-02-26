import { Fragment, useMemo } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import { CheckIcon } from '@heroicons/react/outline'
import { useTransaction } from './TransactionProvider'
import Modal from 'components/shared/Modal'

export default function TransactionModal() {
    const { modalTitle, modalOpen, setModalOpen, steps, currentStepNo } =
        useTransaction()

    const closeable = useMemo(
        () => currentStepNo >= steps.length,
        [steps, currentStepNo]
    )

    return (
        <Modal
            title={modalTitle}
            show={modalOpen}
            closeable={closeable}
            onClose={() => setModalOpen(false)}
            className="md:w-[500px]"
        >
            <div>
                <div className="flex justify-center p-16">
                    <div className="space-y-3">
                        {steps.map((desc, i) => (
                            <div
                                className="flex items-center"
                                key={`transaction-step-${i}`}
                            >
                                <div className="flex h-11 w-11 items-center justify-center">
                                    {i < currentStepNo ? (
                                        <CheckIcon className="-m-1.5 h-11 w-11 text-valid" />
                                    ) : i == currentStepNo ? (
                                        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-pending border-t-transparent" />
                                    ) : (
                                        <div className="h-4 w-4 rounded-full border-[3px] border-gray-2" />
                                    )}
                                </div>

                                <p className="ml-5">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <p
                    className={`px-12 text-center text-gray-2 transition ${
                        closeable
                            ? 'opacity-100'
                            : 'hidden opacity-0'
                    }`}
                >
                    You can safely close this window and come back later to
                    check on the transaction
                </p>
            </div>
        </Modal>
    )
}
