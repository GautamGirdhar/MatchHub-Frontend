import { useState } from 'react';
import { UserCard } from '@/services/matchingService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Heart,
    X,
    Star,
    MapPin,
    Briefcase,
    GraduationCap,
    Ruler,
    Sparkles
} from 'lucide-react';
import Image from 'next/image';

interface SwipeCardProps {
    user: UserCard;
    style?: React.CSSProperties;
    onSwipe?: (direction: 'left' | 'right' | 'up') => void;
}

export default function SwipeCard({ user, style, onSwipe }: SwipeCardProps) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const photos = user.photos.length > 0 ? user.photos : [user.primary_photo || ''];

    const handlePhotoClick = (e: React.MouseEvent) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const halfWidth = rect.width / 2;

        if (x < halfWidth && currentPhotoIndex > 0) {
            setCurrentPhotoIndex(currentPhotoIndex - 1);
        } else if (x >= halfWidth && currentPhotoIndex < photos.length - 1) {
            setCurrentPhotoIndex(currentPhotoIndex + 1);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart || !onSwipe) return;

        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY,
        };

        const deltaX = touchEnd.x - touchStart.x;
        const deltaY = touchEnd.y - touchStart.y;

        // Swipe threshold
        const threshold = 50;

        if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -threshold) {
            // Swipe up - super like
            onSwipe('up');
        } else if (deltaX > threshold) {
            // Swipe right - like
            onSwipe('right');
        } else if (deltaX < -threshold) {
            // Swipe left - pass
            onSwipe('left');
        }

        setTouchStart(null);
    };

    return (
        <Card
            className="absolute w-full h-full overflow-hidden rounded-2xl shadow-2xl"
            style={style}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Photo Section */}
            <div
                className="relative h-full cursor-pointer"
                onClick={handlePhotoClick}
            >
                <Image
                    src={photos[currentPhotoIndex]}
                    alt={user.first_name}
                    className="w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Photo Indicators */}
                {photos.length > 1 && (
                    <div className="absolute top-4 left-4 right-4 flex gap-1">
                        {photos.map((_, index) => (
                            <div
                                key={index}
                                className={`flex-1 h-1 rounded-full transition-all ${index === currentPhotoIndex
                                    ? 'bg-white'
                                    : 'bg-white/40'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Compatibility Score */}
                {user.compatibility_score !== undefined && user.compatibility_score > 0 && (
                    <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 text-sm font-semibold">
                            <Sparkles className="w-3 h-3 mr-1 inline" />
                            {Math.round(user.compatibility_score)}% Match
                        </Badge>
                    </div>
                )}

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="mb-4">
                        <h2 className="text-3xl font-bold mb-1">
                            {user.first_name}, {user.age}
                        </h2>

                        <div className="flex flex-wrap gap-2 text-sm mb-3">
                            {user.course && (
                                <span className="flex items-center gap-1">
                                    <Briefcase className="w-4 h-4" />
                                    {user.course}
                                </span>
                            )}
                            {user.graduation_year && (
                                <span className="flex items-center gap-1">
                                    <GraduationCap className="w-4 h-4" />
                                    Class of {user.graduation_year}
                                </span>
                            )}
                        </div>

                        {user.bio && !showDetails && (
                            <p className="text-sm line-clamp-2 mb-2">{user.bio}</p>
                        )}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDetails(!showDetails);
                            }}
                            className="text-sm font-medium underline"
                        >
                            {showDetails ? 'Show Less' : 'See More'}
                        </button>
                    </div>

                    {/* Expanded Details */}
                    {showDetails && (
                        <div className="space-y-3 mb-4 bg-black/40 backdrop-blur-sm rounded-lg p-4">
                            {user.bio && (
                                <div>
                                    <p className="text-sm">{user.bio}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {user.height_cm && (
                                    <div className="flex items-center gap-2">
                                        <Ruler className="w-4 h-4" />
                                        <span>{user.height_cm} cm</span>
                                    </div>
                                )}
                                {user.looking_for && (
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-4 h-4" />
                                        <span className="capitalize">
                                            {user.looking_for.replace('_', ' ')}
                                        </span>
                                    </div>
                                )}
                                {user.religion && (
                                    <div className="flex items-center gap-2">
                                        <span>🕉️</span>
                                        <span>{user.religion}</span>
                                    </div>
                                )}
                            </div>

                            {user.interests.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold mb-2 uppercase opacity-75">
                                        Interests
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {user.interests.map((interest, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="bg-white/20 text-white backdrop-blur-sm"
                                            >
                                                {interest}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}