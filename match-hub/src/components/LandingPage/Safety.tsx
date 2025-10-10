'use client'
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Ban, FileText, Lock, CheckCircle2 } from "lucide-react";

export function SafetySection() {
    const features = [
        {
            icon: <ShieldCheck className="w-7 h-7" strokeWidth={2.5} />,
            title: "College ID Verification",
            description:
                "Only verified college students can join. Every user must confirm their student status using a valid college ID or institutional email.",
            gradient: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            borderColor: "border-blue-200 dark:border-blue-800",
        },
        {
            icon: <Search className="w-7 h-7" strokeWidth={2.5} />,
            title: "AI-Powered Profile Screening",
            description:
                "We use AI tools to detect fake profiles, inappropriate content, or suspicious behavior before it reaches others.",
            gradient: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            borderColor: "border-purple-200 dark:border-purple-800",
        },
        {
            icon: <Ban className="w-7 h-7" strokeWidth={2.5} />,
            title: "Report & Block Instantly",
            description:
                "If someone crosses a line, you can report or block them immediately. Our moderation team takes quick action to keep the community safe.",
            gradient: "from-red-500 to-orange-500",
            bgColor: "bg-red-50 dark:bg-red-900/20",
            borderColor: "border-red-200 dark:border-red-800",
        },
        {
            icon: <FileText className="w-7 h-7" strokeWidth={2.5} />,
            title: "Community Guidelines",
            description:
                "Everyone must agree to our respectful communication rules before joining — we believe dating should feel comfortable, not creepy.",
            gradient: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            borderColor: "border-green-200 dark:border-green-800",
        },
        {
            icon: <Lock className="w-7 h-7" strokeWidth={2.5} />,
            title: "Privacy First",
            description:
                "We never share your personal info publicly. Your data, chats, and preferences stay encrypted and secure.",
            gradient: "from-indigo-500 to-purple-500",
            bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
            borderColor: "border-indigo-200 dark:border-indigo-800",
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white via-purple-50 to-pink-50 dark:from-neutral-950 dark:via-purple-950/10 dark:to-pink-950/10 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                            Your Safety, Our Priority{" "}
                            <span className="inline-block">🔒</span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                            MatchHub ensures that every student connects in a safe, respectful, and verified environment — because real connections start with trust.
                        </p>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`relative rounded-2xl border-2 ${feature.borderColor} ${feature.bgColor} p-6 transition-all duration-300 hover:shadow-xl`}
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 shadow-lg`}>
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-base text-gray-700 dark:text-neutral-300 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Checkmark Badge */}
                            <div className="absolute top-4 right-4">
                                <CheckCircle2 className={`w-6 h-6 text-green-500 dark:text-green-400`} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center shadow-2xl"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <ShieldCheck className="w-10 h-10" strokeWidth={2.5} />
                        <h3 className="text-2xl md:text-3xl font-bold">
                            100% Verified Student Community
                        </h3>
                    </div>
                    <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
                        Join thousands of verified college students who trust MatchHub for safe, authentic connections on campus.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 px-8 py-3 bg-white text-purple-600 font-bold rounded-full hover:shadow-lg transition-shadow"
                    >
                        Join Safely Today
                    </motion.button>
                </motion.div>

                {/* Additional Trust Indicators */}
                <div className="mt-12 flex flex-wrap justify-center gap-6 text-center">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-neutral-300">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium">24/7 Moderation</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-neutral-300">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium">Encrypted Messaging</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-neutral-300">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium">GDPR Compliant</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-neutral-300">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium">Student Privacy Protected</span>
                    </div>
                </div>
            </div>
        </section>
    );
}