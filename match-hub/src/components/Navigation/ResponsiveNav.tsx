"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Users, MessageSquare, Menu } from "lucide-react";

type NavProps = {
    unreadMessages?: number;
    notifications?: number;
};

const links = [
    { href: "/discover", label: "Discover", Icon: Home },
    { href: "/search", label: "Search", Icon: Search },
    // Social replaces Matches + Friends — marked "coming soon" in UI
    { href: "/social", label: "Social", Icon: Users },
    { href: "/messages", label: "Messages", Icon: MessageSquare },
] as const;

export default function ResponsiveNav({
    unreadMessages = 0,
    notifications = 0,
}: NavProps) {
    const path = usePathname() || "";

    const isActive = (href: string) => {
        if (href === "/") return path === "/";
        return path.startsWith(href);
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 lg:w-72 bg-white border-r shadow-sm p-4 z-20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">
                        MH
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">MatchHub</h3>
                        <p className="text-xs text-slate-500">College Dating</p>
                    </div>
                </div>

                <nav className="flex-1">
                    <ul className="space-y-1">
                        {links.map(({ href, label, Icon, comingSoon }: any) => {
                            const active = isActive(href);
                            return (
                                <li key={href}>
                                    <Link
                                        href={comingSoon ? "#" : href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-md group ${active
                                            ? "bg-pink-50 text-pink-600 font-semibold ring-1 ring-pink-100"
                                            : "text-slate-700 hover:bg-slate-50"
                                            } ${comingSoon ? "opacity-90" : ""}`}
                                        onClick={(e) => {
                                            if (comingSoon) e.preventDefault();
                                        }}
                                    >
                                        <Icon
                                            className={`w-5 h-5 ${active ? "text-pink-600" : "text-slate-400 group-hover:text-slate-600"
                                                }`}
                                        />
                                        <div className="flex items-baseline gap-2 w-full">
                                            <span className="text-sm">{label}</span>
                                            {comingSoon && (
                                                <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                    Coming soon
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="mt-6 pt-4 border-t">
                    <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold">Y</div>
                        <div className="text-sm">
                            <div className="font-medium">You</div>
                            <div className="text-xs text-slate-500">View profile</div>
                        </div>
                        <Menu className="ml-auto w-4 h-4 text-slate-400" />
                    </Link>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(96%,460px)] md:hidden">
                <div className="backdrop-blur-sm bg-white/90 border rounded-2xl shadow-lg px-3 py-2 flex items-center justify-between">
                    {links.map(({ href, label, Icon, comingSoon }: any) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={href}
                                href={comingSoon ? "#" : href}
                                className={`flex-1 flex flex-col items-center justify-center px-2 py-1 rounded-lg text-center ${active ? "text-pink-600" : "text-slate-500"
                                    } ${comingSoon ? "opacity-90" : ""}`}
                                onClick={(e) => {
                                    if (comingSoon) e.preventDefault();
                                }}
                            >
                                <div className="relative">
                                    <Icon className={`w-6 h-6 ${active ? "text-pink-600" : "text-slate-400"}`} />
                                    {href === "/messages" && unreadMessages > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] px-1 rounded-full">
                                            {unreadMessages > 9 ? "9+" : unreadMessages}
                                        </span>
                                    )}
                                </div>
                                <div className="text-[11px] mt-1 flex items-center gap-1">
                                    <span>{label}</span>
                                    {comingSoon && <span className="text-[10px] text-slate-400">• coming</span>}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}