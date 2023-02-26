import { Fragment, ReactNode, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'

interface ModalProps {
    title: string
    description?: string
    show: boolean
    closeable?: boolean
    className?: string
    onClose: () => void
    children: ReactNode
}
export default function Modal({
    title,
    description,
    show,
    closeable = true,
    className,
    onClose,
    children,
}: ModalProps) {
    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={() => closeable && onClose()}
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
                                className={`${className} relative w-full max-w-screen-xl rounded-xl bg-dull-gray p-6 shadow-xl shadow-white/5 md:p-8`}
                            >
                                <div className="flex items-center justify-between">
                                    <Dialog.Title
                                        as="h2"
                                        className="text-[24px] uppercase md:text-[32px]"
                                    >
                                        {title}
                                    </Dialog.Title>
                                    <XIcon
                                        className={`w-6 md:w-8 ${
                                            (closeable &&
                                                'cursor-pointer hover:opacity-80') ||
                                            'opacity-50'
                                        }`}
                                        onClick={() => closeable && onClose()}
                                    />
                                </div>
                                {description && (
                                    <Dialog.Description
                                        as="p"
                                        className="mt-4 whitespace-pre-wrap md:mt-6"
                                    >
                                        {description}
                                    </Dialog.Description>
                                )}
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
