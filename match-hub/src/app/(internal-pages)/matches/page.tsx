'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { matchingService, Match } from '@/services/matchingService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Heart,
    MessageCircle,
    Sparkles,
    UserX,
    Calendar,
    Users
} from 'lucide-react';

export default function MatchesPage() {
    const router = useRouter();
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [unmatchDialog, setUnmatchDialog] = useState<Match | null>(null);
    const [unmatching, setUnmatching] = useState(false);

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {
        try {
            setLoading(true);
            const data = await matchingService.getMatches();
            setMatches(data);
        } catch (error) {
            console.error('Failed to load matches:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnmatch = async () => {
        if (!unmatchDialog || unmatching) return;

        setUnmatching(true);
        try {
            await matchingService.unmatch(unmatchDialog.match_id);
            setMatches(matches.filter(m => m.match_id !== unmatchDialog.match_id));
            setUnmatchDialog(null);
        } catch (error) {
            console.error('Failed to unmatch:', error);
            alert('Failed to unmatch. Please try again.');
        } finally {
            setUnmatching(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
                <div className="bg-white border-b sticky top-0 z-10">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Matches</h1>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Heart className="w-6 h-6 text-pink-600 fill-pink-600" />
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                Matches
                            </h1>
                            <Badge className="bg-pink-600">{matches.length}</Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 pb-20">
                {matches.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No Matches Yet</h2>
                        <p className="text-gray-600 mb-6">
                            Start swiping to find your perfect match!
                        </p>
                        <Button
                            onClick={() => router.push('/discover')}
                            className="bg-pink-600 hover:bg-pink-700"
                        >
                            Start Discovering
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {matches.map((match) => (
                            <Card key={match.match_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                    <div className="flex flex-col sm:flex-row">
                                        {/* Photo */}
                                        <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gradient-to-br from-pink-400 to-purple-500">
                                            {match.user.primary_photo ? (
                                                <img
                                                    src={match.user.primary_photo}
                                                    alt={match.user.first_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <Users className="w-16 h-16 text-white/50" />
                                                </div>
                                            )}

                                            {match.compatibility_score !== undefined && match.compatibility_score > 0 && (
                                                <Badge className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-500">
                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                    {Math.round(match.compatibility_score)}%
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 p-4 sm:p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                        {match.user.first_name}, {match.user.age}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                                                        {match.user.course && (
                                                            <span>{match.user.course}</span>
                                                        )}
                                                        {match.user.graduation_year && (
                                                            <span>• Class of {match.user.graduation_year}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {match.user.bio && (
                                                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                                                    {match.user.bio}
                                                </p>
                                            )}

                                            {match.user.interests.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {match.user.interests.slice(0, 4).map((interest, idx) => (
                                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                                {interest}
                                                            </Badge>
                                                        ))}
                                                        {match.user.interests.length > 4 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                +{match.user.interests.length - 4} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                                <Calendar className="w-3 h-3" />
                                                <span>Matched {formatDate(match.matched_at)}</span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3">
                                                <Button
                                                    className="flex-1 bg-pink-600 hover:bg-pink-700"
                                                    onClick={() => router.push(`/chat/${match.match_id}`)}
                                                >
                                                    <MessageCircle className="w-4 h-4 mr-2" />
                                                    Send Message
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setUnmatchDialog(match)}
                                                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                                >
                                                    <UserX className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Unmatch Confirmation Dialog */}
            <Dialog open={!!unmatchDialog} onOpenChange={() => setUnmatchDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Unmatch with {unmatchDialog?.user.first_name}?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. You won't be able to message each other anymore.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-3 mt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setUnmatchDialog(null)}
                            disabled={unmatching}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={handleUnmatch}
                            disabled={unmatching}
                        >
                            {unmatching ? 'Unmatching...' : 'Unmatch'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}