"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon, SendHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useFeedbackModal } from "@/contexts/ModalContext";
import {
    Frown,
    Meh,
    Smile,
    Laugh,
    Zap, // small variety icon
} from "lucide-react";

const icons = [Frown, Meh, Smile, Laugh, Zap];

export default function FeedbackModal() {
    const { isOpen, close } = useFeedbackModal();
    const [score, setScore] = useState<number>(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setScore(0);
            setComment("");
        }
    }, [isOpen]);

    const submit = async () => {
        if (!score) {
            toast.error("Choose a reaction before submitting.");
            return;
        }

        // lightweight fake submit - replace with your mutation hook
        try {
            toast.loading("Submitting...");
            await new Promise((r) => setTimeout(r, 700));
            toast.dismiss();
            toast.success("Thanks for the feedback!");
            close();
            setScore(0);
            setComment("");
        } catch (e) {
            toast.dismiss();
            toast.error("Failed to submit feedback.");
        }
    };

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
                                        Feedback
                                    </Dialog.Title>
                                    <XCircleIcon
                                        className="h-6 w-6 cursor-pointer text-slate-600"
                                        onClick={close}
                                    />
                                </div>

                                <div className="p-5">
                                    <p className="mb-4 text-sm text-slate-700">
                                        Help us improve MatchHub — choose a reaction and add any note.
                                    </p>

                                    <div className="mb-4 flex items-center justify-between space-x-2">
                                        {icons.map((Icon, i) => (
                                            <Icon
                                                key={i}
                                                className={`h-8 w-8 cursor-pointer transition-colors ${score === i + 1 ? "text-blue-600" : "text-slate-300"
                                                    }`}
                                                onClick={() => setScore(i + 1)}
                                            />
                                        ))}
                                    </div>

                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={4}
                                        placeholder="Anything else to add? (optional)"
                                        className="w-full rounded-md border px-3 py-2 text-sm placeholder-slate-400"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 px-5 py-4 border-t bg-gray-50">
                                    <button
                                        onClick={close}
                                        className="rounded-md border px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={submit}
                                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                                    >
                                        Submit <SendHorizontal className="h-4 w-4" />
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        )
    );
}