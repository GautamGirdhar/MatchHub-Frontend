"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useSubscriptionModal } from "@/contexts/ModalContext";

export default function SubscriptionModal() {
    const { isOpen, content, close } = useSubscriptionModal();

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
                            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-slate-200 overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 border-b">
                                    <Dialog.Title className="text-sm font-medium">
                                        {content?.planName ?? "Subscription required"}
                                    </Dialog.Title>
                                    <XCircle
                                        className="h-6 w-6 cursor-pointer text-slate-600"
                                        onClick={close}
                                    />
                                </div>

                                <div className="p-5">
                                    <p className="text-sm text-slate-700 mb-6">
                                        {content?.message ??
                                            "You've reached a usage limit. Upgrade to continue using MatchHub."}
                                    </p>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={close}
                                            className="rounded-md border px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            Later
                                        </button>

                                        <Link
                                            href={content?.ctaHref ?? "/subscribe"}
                                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                                            onClick={close}
                                        >
                                            {content?.ctaText ?? "Upgrade"}
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Link>
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