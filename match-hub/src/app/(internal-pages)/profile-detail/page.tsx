'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { profileService, CompleteProfile, ProfilePhoto } from '@/services/profileService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Edit,
    Camera,
    Trash2,
    Star,
    StarOff,
    GripVertical,
    User,
    Heart,
    Ruler,
    GraduationCap,
    Calendar,
    BookOpen,
    MapPin
} from 'lucide-react';

export default function ViewProfile() {
    const router = useRouter();
    const [profile, setProfile] = useState<CompleteProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [draggedPhoto, setDraggedPhoto] = useState<ProfilePhoto | null>(null);
    const [activePhotoId, setActivePhotoId] = useState<number | null>(null);


    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await profileService.getCompleteProfile();
            setProfile(data);
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoClick = (photoId: number) => {
        if (window.innerWidth < 768) { // mobile only
            setActivePhotoId(prev => (prev === photoId ? null : photoId));
        }
    };


    const handleSetPrimary = async (photoId: number) => {
        try {
            await profileService.updatePhoto(photoId, { is_primary: true });
            await loadProfile();
        } catch (error) {
            console.error('Failed to set primary photo:', error);
            alert('Failed to set primary photo');
        }
    };

    const handleDeletePhoto = async () => {
        if (!photoToDelete) return;

        setIsDeleting(true);
        try {
            await profileService.deletePhoto(photoToDelete);
            await loadProfile();
            setPhotoToDelete(null);
        } catch (error) {
            console.error('Failed to delete photo:', error);
            alert('Failed to delete photo');
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            const file = e.target.files[0];
            await profileService.uploadPhoto(file, profile?.photos.length === 0);
            await loadProfile();
        } catch (error) {
            console.error('Failed to upload photo:', error);
            alert('Failed to upload photo');
        }
    };

    const handleDragStart = (photo: ProfilePhoto) => {
        setDraggedPhoto(photo);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (targetPhoto: ProfilePhoto) => {
        if (!draggedPhoto || !profile) return;

        const photos = [...profile.photos];
        const draggedIndex = photos.findIndex(p => p.id === draggedPhoto.id);
        const targetIndex = photos.findIndex(p => p.id === targetPhoto.id);

        photos.splice(draggedIndex, 1);
        photos.splice(targetIndex, 0, draggedPhoto);

        const photoOrders = photos.map((photo, index) => ({
            id: photo.id,
            display_order: index,
        }));

        try {
            await profileService.reorderPhotos(photoOrders);
            await loadProfile();
        } catch (error) {
            console.error('Failed to reorder photos:', error);
            alert('Failed to reorder photos');
        }

        setDraggedPhoto(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Failed to load profile</p>
            </div>
        );
    }

    const primaryPhoto = profile.photos.find(p => p.is_primary);

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h1>
                    <Button
                        onClick={() => router.push('/profile/edit')}
                        className="bg-pink-600 cursor-pointer hover:bg-pink-700"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pb-20">
                {/* Photo Gallery */}
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Photos</h2>
                            <label htmlFor="photo-upload">
                                <Button variant="outline" size="sm" asChild>
                                    <span className="cursor-pointer">
                                        <Camera className="w-4 h-4 mr-2" />
                                        Add Photo
                                    </span>
                                </Button>
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoUpload}
                                />
                            </label>
                        </div>

                        {profile.photos.length === 0 ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600 mb-2">No photos yet</p>
                                <p className="text-sm text-gray-500">Add your first photo to get started</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {profile.photos.map(photo => (
                                    <div
                                        key={photo.id}
                                        className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer"
                                        onClick={() => handlePhotoClick(photo.id)}
                                    >
                                        <img src={photo.photo} alt="Profile" className="w-full h-full object-cover" />

                                        {/* Overlay */}
                                        <div
                                            className={`
        absolute inset-0 bg-black/50 flex items-center justify-center gap-2 
        opacity-0 transition-opacity duration-200
        md:group-hover:opacity-100
        ${activePhotoId === photo.id ? 'opacity-100' : ''}
      `}
                                        >
                                            {!photo.is_primary && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={(e) => { e.stopPropagation(); handleSetPrimary(photo.id); }}
                                                >
                                                    <Star className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={(e) => { e.stopPropagation(); setPhotoToDelete(photo.id); }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-4">
                            💡 Drag photos to reorder • Click star to set as primary • Hover to see options
                        </p>
                    </CardContent>
                </Card>

                {/* Profile Card - How others see you */}
                <Card className="overflow-hidden">
                    <div className="relative h-64 sm:h-80 bg-gradient-to-br from-pink-400 to-purple-500">
                        {primaryPhoto ? (
                            <img
                                src={primaryPhoto.photo}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <User className="w-24 h-24 text-white/50" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Name and basic info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h2 className="text-3xl font-bold mb-2">
                                {profile.user.first_name} {profile.user.last_name}
                            </h2>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date().getFullYear() - new Date(profile.user.date_of_birth).getFullYear()} years
                                </span>
                                <span className="flex items-center gap-1">
                                    <GraduationCap className="w-4 h-4" />
                                    {profile.profile.course}
                                </span>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-6 space-y-6">
                        {/* Bio */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">About</h3>
                            <p className="text-gray-700 leading-relaxed">
                                {profile.profile.bio || 'No bio added yet'}
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-pink-100 rounded-lg">
                                    <Heart className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Looking for</p>
                                    <p className="font-medium capitalize">
                                        {profile.profile.looking_for?.replace('_', ' ') || 'Not specified'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Ruler className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Height</p>
                                    <p className="font-medium">{profile.profile.height_cm || '-'} cm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <GraduationCap className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Course</p>
                                    <p className="font-medium">{profile.profile.course || '-'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Graduation Year</p>
                                    <p className="font-medium">{profile.profile.graduation_year || '-'}</p>
                                </div>
                            </div>

                            {profile.profile.religion && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <BookOpen className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Religion</p>
                                        <p className="font-medium">{profile.profile.religion}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interests */}
                        {profile.interests.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.interests.map((interest) => (
                                        <Badge
                                            key={interest.id}
                                            variant="secondary"
                                            className="px-3 py-1 bg-pink-100 text-pink-700 hover:bg-pink-200"
                                        >
                                            {interest.interest_name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Preferences */}
                        <div className="border-t pt-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                                My Preferences
                            </h3>
                            <div className="space-y-2">
                                <p className="text-sm">
                                    <span className="text-gray-600">Interested in:</span>{' '}
                                    <span className="font-medium capitalize">
                                        {profile.preferences.gender_preference}
                                    </span>
                                </p>
                                {profile.preferences.education_preference && (
                                    <p className="text-sm">
                                        <span className="text-gray-600">Education preference:</span>{' '}
                                        <span className="font-medium">
                                            {profile.preferences.education_preference}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Info */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Email</span>
                                <span className="font-medium">{profile.user.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Gender</span>
                                <span className="font-medium capitalize">{profile.user.gender}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Registration Number</span>
                                <span className="font-medium">{profile.user.college_registration_number}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!photoToDelete} onOpenChange={() => setPhotoToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Photo</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600">
                        Are you sure you want to delete this photo? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 mt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setPhotoToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={handleDeletePhoto}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}