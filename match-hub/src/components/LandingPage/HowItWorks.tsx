import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { Poppins, Inter } from 'next/font/google';
import { UserCheck, Heart, MessageCircle, ShieldCheck, Users, Sparkles } from "lucide-react";


const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
});

const inter = Inter({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
});


export function TimelineDemo() {
    const data = [
        {
            title: "Step 1",
            content: (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <UserCheck className="w-8 h-8 text-white" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200">
                            Create Your Verified Profile
                        </h3>
                    </div>
                    <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Sign up using your college ID, upload a photo, and get verified instantly to ensure a safe, authentic community.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">College Verified</p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">100% student community</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                            <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">Instant Setup</p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">Takes less than 2 mins</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Step 2",
            content: (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Heart className="w-8 h-8 text-white" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200">
                            Find Your Perfect Match
                        </h3>
                    </div>
                    <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Discover verified students from your campus who share your vibe and interests. Swipe, connect, and vibe!
                    </p>
                    <div className="flex flex-wrap gap-3 mt-6">
                        <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                            🎓 Same Campus
                        </span>
                        <span className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium">
                            ✨ Shared Interests
                        </span>
                        <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                            💫 Real Connections
                        </span>
                    </div>
                </div>
            ),
        },
        {
            title: "Step 3",
            content: (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <MessageCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200">
                            Start Chatting Securely
                        </h3>
                    </div>
                    <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Once you match, chat directly in a private and secure space. You can also block or report users anytime.
                    </p>
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 mt-6">
                        <div className="flex items-start gap-4">
                            <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-neutral-800 dark:text-neutral-200 mb-2">Safe & Private</h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    End-to-end encrypted messages, block/report features, and 24/7 moderation to keep you safe.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <section id="how-it-works" className="py-20 bg-gradient-to-b from-white via-purple-50 to-pink-50 dark:from-neutral-950 dark:via-purple-950/10 dark:to-pink-950/10 px-6">
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className={`${poppins.className} text-center mb-16`}>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                        How{" "}
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            MatchHub
                        </span>{" "}
                        Works
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Simple, safe, and student-focused — connect in just 3 easy steps.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative w-full overflow-clip">
                    <Timeline data={data} />
                </div>
            </div>
        </section>
    );
}