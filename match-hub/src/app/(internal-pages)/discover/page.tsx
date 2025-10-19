'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { matchingService, UserCard, SwipeLimits } from '@/services/matchingService';
import SwipeCard from '@/components/matching/SwipeCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Heart,
    X,
    Star,
    RotateCcw,
    Zap,
    Sparkles,
    Users,
    TrendingUp,
    LogIn,
    AlertCircle
} from 'lucide-react';

export default function DiscoveryPage() {
    const router = useRouter();
    const [users, setUsers] = useState<UserCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipeLimits, setSwipeLimits] = useState<SwipeLimits | null>(null);
    const [loading, setLoading] = useState(true);
    const [swiping, setSwiping] = useState(false);
    const [cardStyle, setCardStyle] = useState<React.CSSProperties>({});
    const [showMatchDialog, setShowMatchDialog] = useState(false);
    const [matchedUser, setMatchedUser] = useState<UserCard | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [authError, setAuthError] = useState<string>('');

    useEffect(() => {
        loadCards();
        loadLimits();
    }, []);

    const loadCards = async () => {
        try {
            setLoading(true);
            setAuthError('');
            const cards = await matchingService.getDiscoveryCards(20);
            setUsers(cards);
            setCurrentIndex(0);
            setIsAuthenticated(true);
        } catch (error: any) {
            console.error('Failed to load cards:', error);

            // Check if it's an authentication error
            if (error.response?.status === 401 || error.response?.status === 403) {
                setIsAuthenticated(false);
                setAuthError(error.response?.data?.message || 'You need to be logged in to view matches');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadLimits = async () => {
        try {
            const limits = await matchingService.getSwipeLimits();
            setSwipeLimits(limits);
        } catch (error: any) {
            console.error('Failed to load limits:', error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                setIsAuthenticated(false);
            }
        }
    };

    const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
        if (swiping || currentIndex >= users.length) return;

        setSwiping(true);
        const currentUser = users[currentIndex];

        // Animate card
        const distance = window.innerWidth;
        let transform = '';

        if (direction === 'left') {
            transform = `translateX(-${distance}px) rotate(-20deg)`;
        } else if (direction === 'right') {
            transform = `translateX(${distance}px) rotate(20deg)`;
        } else if (direction === 'up') {
            transform = `translateY(-${distance}px) scale(1.1)`;
        }

        setCardStyle({
            transform,
            transition: 'transform 0.3s ease-out',
            opacity: 0,
        });

        // Determine action
        let action: 'like' | 'super_like' | 'pass';
        if (direction === 'left') action = 'pass';
        else if (direction === 'up') action = 'super_like';
        else action = 'like';

        try {
            const result = await matchingService.swipe({
                action,
                target_user_id: currentUser.user_id,
            });

            // Update limits
            setSwipeLimits((prev) => prev ? {
                ...prev,
                remaining_likes: result.remaining_likes,
                remaining_super_likes: result.remaining_super_likes,
                likes_used: prev.daily_likes_limit - result.remaining_likes,
                super_likes_used: prev.daily_super_likes_limit - result.remaining_super_likes,
            } : null);

            // Show match dialog if it's a match
            if (result.is_match) {
                setMatchedUser(currentUser);
                setShowMatchDialog(true);
            }

            // Move to next card after animation
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                setCardStyle({});
                setSwiping(false);

                // Load more cards if running low
                if (currentIndex >= users.length - 3) {
                    loadMoreCards();
                }
            }, 300);
        } catch (error: any) {
            console.error('Swipe failed:', error);

            // Check for auth error
            if (error.response?.status === 401 || error.response?.status === 403) {
                setIsAuthenticated(false);
                setAuthError('Your session has expired. Please log in again.');
            } else {
                alert(error.response?.data?.message || 'Swipe failed. Please try again.');
            }

            setCardStyle({});
            setSwiping(false);
        }
    };

    const loadMoreCards = async () => {
        try {
            const moreCards = await matchingService.getDiscoveryCards(10);
            setUsers((prev) => [...prev, ...moreCards]);
        } catch (error) {
            console.error('Failed to load more cards:', error);
        }
    };

    const currentUser = users[currentIndex];
    const hasMoreUsers = currentIndex < users.length;

    // Not authenticated view
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-pink-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Authentication Required
                    </h2>

                    <p className="text-gray-600 mb-6">
                        {authError || 'You need to be logged in to discover and match with other users.'}
                    </p>

                    <div className="space-y-3">
                        <Button
                            onClick={() => router.push('/login')}
                            className="w-full bg-pink-600 hover:bg-pink-700"
                        >
                            <LogIn className="w-4 h-4 mr-2" />
                            Log In
                        </Button>

                        <Button
                            onClick={() => router.push('/signup')}
                            variant="outline"
                            className="w-full"
                        >
                            Create Account
                        </Button>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                        Don't have an account? Sign up to start matching!
                    </p>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Finding matches for you...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-lg mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-pink-600" />
                            <h1 className="text-xl font-bold text-gray-900">Discover</h1>
                        </div>

                        {swipeLimits && (
                            <div className="flex items-center gap-3 text-sm">
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Heart className="w-3 h-3 text-pink-500" />
                                    {swipeLimits.remaining_likes}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-blue-500" />
                                    {swipeLimits.remaining_super_likes}
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-lg mx-auto px-4 py-6">
                {!hasMoreUsers ? (
                    <Card className="p-12 text-center">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No More Profiles</h2>
                        <p className="text-gray-600 mb-6">
                            You've seen everyone! Check back later for more matches.
                        </p>
                        <Button
                            onClick={loadCards}
                            className="bg-pink-600 hover:bg-pink-700"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </Card>
                ) : (
                    <>
                        {/* Card Stack */}
                        <div className="relative w-full aspect-[3/4] mb-6">
                            {/* Next card preview */}
                            {users[currentIndex + 1] && (
                                <div className="absolute inset-0 scale-95 opacity-50">
                                    <SwipeCard user={users[currentIndex + 1]} />
                                </div>
                            )}

                            {/* Current card */}
                            {currentUser && (
                                <SwipeCard
                                    user={currentUser}
                                    style={cardStyle}
                                    onSwipe={handleSwipe}
                                />
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-center gap-4 mb-6">
                            {/* Pass */}
                            <button
                                onClick={() => handleSwipe('left')}
                                disabled={swiping}
                                className="w-16 h-16 rounded-full bg-white border-2 border-gray-300 shadow-lg hover:scale-110 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <X className="w-8 h-8 text-gray-600" />
                            </button>

                            {/* Super Like */}
                            <button
                                onClick={() => handleSwipe('up')}
                                disabled={swiping || (swipeLimits?.remaining_super_likes || 0) <= 0}
                                className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <Star className="w-8 h-8 text-white fill-white" />
                            </button>

                            {/* Like */}
                            <button
                                onClick={() => handleSwipe('right')}
                                disabled={swiping || (swipeLimits?.remaining_likes || 0) <= 0}
                                className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <Heart className="w-8 h-8 text-white fill-white" />
                            </button>
                        </div>

                        {/* Swipe Instructions */}
                        <div className="text-center text-sm text-gray-500">
                            <p>👆 Tap buttons or swipe cards</p>
                            <p className="mt-1">← Pass • ↑ Super Like • → Like</p>
                        </div>

                        {/* Stats Card */}
                        <Card className="mt-6 p-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Heart className="w-4 h-4 text-pink-500" />
                                        <p className="text-xs font-medium text-gray-600">Likes</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {swipeLimits?.remaining_likes || 0}
                                    </p>
                                    <p className="text-xs text-gray-500">per day</p>
                                </div>

                                <div>
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <X className="w-4 h-4 text-gray-500" />
                                        <p className="text-xs font-medium text-gray-600">Passes</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {swipeLimits?.remaining_passes || 0}
                                    </p>
                                    <p className="text-xs text-gray-500">per day</p>
                                </div>

                                <div>
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Star className="w-4 h-4 text-blue-500" />
                                        <p className="text-xs font-medium text-gray-600">Super</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {swipeLimits?.remaining_super_likes || 0}
                                    </p>
                                    <p className="text-xs text-gray-500">ever</p>
                                </div>
                            </div>
                        </Card>
                    </>
                )}
            </div>

            {/* Match Dialog */}
            <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl">
                            It's a Match! 🎉
                        </DialogTitle>
                    </DialogHeader>

                    {matchedUser && (
                        <div className="text-center space-y-4">
                            <div className="relative w-32 h-32 mx-auto">
                                <img
                                    src={matchedUser.primary_photo || matchedUser.photos[0]}
                                    alt={matchedUser.first_name}
                                    className="w-full h-full rounded-full object-cover border-4 border-pink-500"
                                />
                                {matchedUser.compatibility_score && (
                                    <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500">
                                        {Math.round(matchedUser.compatibility_score)}% Match
                                    </Badge>
                                )}
                            </div>

                            <div>
                                <h3 className="text-xl font-bold">
                                    You and {matchedUser.first_name} liked each other!
                                </h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    Start a conversation and get to know each other better.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowMatchDialog(false)}
                                >
                                    Keep Swiping
                                </Button>
                                <Button
                                    className="flex-1 bg-pink-600 hover:bg-pink-700"
                                    onClick={() => {
                                        setShowMatchDialog(false);
                                        router.push('/matches');
                                    }}
                                >
                                    Send Message
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}