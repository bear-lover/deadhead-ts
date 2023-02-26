import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useMemo } from 'react'
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import { useTransaction } from './TransactionProvider'
import { TransactionResult } from 'config/types'

export default function TransactionResultModal() {
    const { result, resultModalOpen, setResultModalOpen } = useTransaction()
    const invalid = useMemo(() => result != TransactionResult.SUCCESS, [result])

    return (
        <Transition appear show={resultModalOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={() => setResultModalOpen(false)}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="fixed inset-0 bg-black/80"
                        aria-hidden="true"
                    />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-6 md:p-8">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={`relative flex w-fit rounded-xl bg-dull-gray py-3.5 px-20 shadow-xl shadow-white/5 ${
                                    invalid
                                        ? 'bg-invalid'
                                        : 'bg-valid text-black'
                                }`}
                            >
                                {invalid ? (
                                    <ExclamationCircleIcon className="-m-1.5 h-11 w-11" />
                                ) : (
                                    <CheckIcon className="-m-1.5 h-11 w-11" />
                                )}

                                <Dialog.Title
                                    as="h2"
                                    className="ml-5 text-[32px]"
                                >
                                    {`Transaction ${
                                        invalid ? 'failed' : 'approved'
                                    }`}
                                </Dialog.Title>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
