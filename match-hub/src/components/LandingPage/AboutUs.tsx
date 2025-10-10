'use client'
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Heart, Users, Zap } from "lucide-react";
import Image from "next/image";

export function AboutSection() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Why MatchHub Exists",
            description:
                "Built by students, for students. We noticed that traditional dating apps don't capture the unique vibe of college life. MatchHub was created to bridge that gap – a platform where college students can connect authentically within their campus community. We believe genuine connections start with understanding that shared college experience.",
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Our Mission",
            description:
                "To create genuine, meaningful campus connections that go beyond superficial matches. We're committed to building a safe, verified community where students can meet others who share their values, interests, and college journey. Our mission is to make dating on campus feel natural, fun, and authentic – turning campus crushes into real connections.",
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "The MatchHub Difference",
            description:
                "Because college life is more fun when shared 💕. We understand that college is about more than just academics – it's about friendships, memories, and yes, romance! MatchHub is designed to help you find your people, your vibe, and maybe even your person. Every swipe, every match, and every conversation brings you closer to your college story.",
        },
    ];

    const toggleFAQ = (index: any) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-gradient-to-b from-white via-purple-50 to-pink-50 dark:from-neutral-950 dark:via-purple-950/10 dark:to-pink-950/10 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                        About{" "}
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            MatchHub
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Discover the story behind your favorite campus dating platform
                    </p>
                </div>

                {/* Main Content - Flex Layout */}
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* FAQ Section */}
                    <div className="flex-1 w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                className="rounded-2xl border-2 border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {/* FAQ Header */}
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-purple-50 dark:hover:bg-neutral-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white">
                                            {faq.icon}
                                        </div>
                                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white text-left">
                                            {faq.title}
                                        </h3>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-shrink-0"
                                    >
                                        <ChevronDown className="w-6 h-6 text-purple-600 dark:text-pink-500" />
                                    </motion.div>
                                </button>

                                {/* FAQ Content */}
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden border-t-2 border-gray-100 dark:border-neutral-800"
                                        >
                                            <p className="px-6 md:px-8 py-6 text-base md:text-lg text-gray-700 dark:text-neutral-300 leading-relaxed">
                                                {faq.description}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    {/* Image Section */}
                    <motion.div
                        className="flex-shrink-0 lg:w-1/3 flex items-center justify-center"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="relative w-full max-w-md lg:max-w-none">
                            <Image
                                src='/onlineDating.svg'
                                alt="Online Dating Illustration"
                                height={400}
                                width={400}
                                className="w-full h-auto object-contain drop-shadow-2xl"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}