"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "lucide-react";
import Link from "next/link";
import { useGeneralModal } from "@/contexts/ModalContext";

export default function GeneralModal() {
    const { isOpen, content, close } = useGeneralModal();

    return (
        isOpen && (
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={close}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-slate-200">
                                <div className="flex items-center justify-between px-5 py-4 border-b">
                                    <Dialog.Title className="text-sm font-medium">
                                        {content?.heading ?? "Notice"}
                                    </Dialog.Title>
                                    <XCircleIcon
                                        className="h-6 w-6 cursor-pointer text-slate-600"
                                        onClick={close}
                                    />
                                </div>

                                <div className="p-5">
                                    {content?.icon && (
                                        <div className="mb-3 flex items-center">{content.icon}</div>
                                    )}
                                    <p className="text-sm text-slate-700 mb-5">
                                        {content?.description ?? ""}
                                    </p>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={close}
                                            className="rounded-lg border px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            Close
                                        </button>

                                        {content?.buttonHref ? (
                                            <Link
                                                href={content.buttonHref}
                                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                                                onClick={close}
                                            >
                                                {content?.buttonName ?? "Go"}
                                            </Link>
                                        ) : content?.buttonName ? (
                                            <button
                                                onClick={close}
                                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                                            >
                                                {content.buttonName}
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        )
    );
}