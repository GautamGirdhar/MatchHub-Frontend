'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Heart, MessageCircle, User } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { icon: Home, label: 'Discover', path: '/discover' },
        { icon: Heart, label: 'Matches', path: '/matches' },
        { icon: MessageCircle, label: 'Messages', path: '/messages' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="max-w-lg mx-auto px-4">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${isActive
                                        ? 'text-pink-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Icon
                                    className={`w-6 h-6 ${isActive ? 'fill-pink-600' : ''}`}
                                />
                                <span className="text-xs font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}