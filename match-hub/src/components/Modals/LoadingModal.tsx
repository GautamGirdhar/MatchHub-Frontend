"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLoadingModal } from "@/contexts/ModalContext";

export default function LoadingScreen() {
    const { isLoading, message, close } = useLoadingModal();

    return (
        isLoading && (
            <Transition appear show={isLoading} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={close}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-150"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-150"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-100"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="flex max-w-sm w-full flex-col items-center gap-4 rounded-lg bg-white px-6 py-8 shadow-lg">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                                <p className="text-sm text-slate-700">{message ?? "Loading..."}</p>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        )
    );
}