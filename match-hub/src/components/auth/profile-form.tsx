'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { profileService, Interest } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';

export default function CompleteProfile() {
    const router = useRouter();
    const { checkProfileCompletion, profileStatus } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        bio: '',
        looking_for: '',
        height_cm: '',
        course: '',
        graduation_year: '',
        religion: '',
    });

    const [preferences, setPreferences] = useState({
        gender_preference: 'both',
        education_preference: '',
    });

    const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
    const [allInterests, setAllInterests] = useState<Interest[]>([]);
    const [photos, setPhotos] = useState<File[]>([]);

    useEffect(() => {
        profileService.getAllInterests().then(setAllInterests).catch(console.error);
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPhotos(Array.from(e.target.files));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await profileService.updateProfile({
                ...formData,
                height_cm: parseInt(formData.height_cm),
                graduation_year: parseInt(formData.graduation_year),
            });

            await profileService.updatePreferences(preferences);

            for (let i = 0; i < photos.length; i++) {
                await profileService.uploadPhoto(photos[i], i === 0);
            }

            if (selectedInterests.length > 0) {
                await profileService.addInterests(selectedInterests);
            }
            router.push('/profile-detail');
            await checkProfileCompletion();
        } catch (error) {
            console.error('Failed to complete profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-pink-50 to-white">
            {/* Fixed Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-4 sm:px-6">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Complete Your Profile
                    </h1>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-600">
                            Step {step} of 4
                        </p>
                        {profileStatus && (
                            <p className="text-sm font-medium text-pink-600">
                                {profileStatus.completion_percentage}% complete
                            </p>
                        )}
                    </div>
                    <Progress value={(step / 4) * 100} className="mt-3 h-2" />
                </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="px-4 py-6 sm:px-6 pb-24">
                <div className="max-w-2xl mx-auto">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-4 sm:p-6 md:p-8">
                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <div className="space-y-5">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                                            Basic Information
                                        </h2>
                                        <p className="text-sm text-gray-500 mb-6">
                                            Let others know more about you
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio" className="text-sm font-medium">Bio *</Label>
                                        <Textarea
                                            id="bio"
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                            className="resize-none text-base"
                                            required
                                        />
                                        <p className="text-xs text-gray-500">
                                            {formData.bio.length}/500 characters
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="looking_for" className="text-sm font-medium">
                                            Looking For *
                                        </Label>
                                        <Select
                                            value={formData.looking_for}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, looking_for: value })
                                            }
                                        >
                                            <SelectTrigger id="looking_for" className="text-base">
                                                <SelectValue placeholder="What are you looking for?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="friendship">Friendship</SelectItem>
                                                <SelectItem value="serious_relationship">
                                                    Serious Relationship
                                                </SelectItem>
                                                <SelectItem value="casual">Casual Dating</SelectItem>
                                                <SelectItem value="long_term">Long-term Connection</SelectItem>
                                                <SelectItem value="networking">Networking</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="height_cm" className="text-sm font-medium">
                                                Height (cm) *
                                            </Label>
                                            <Input
                                                id="height_cm"
                                                name="height_cm"
                                                type="number"
                                                inputMode="numeric"
                                                value={formData.height_cm}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 170"
                                                className="text-base"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="graduation_year" className="text-sm font-medium">
                                                Graduation Year *
                                            </Label>
                                            <Input
                                                id="graduation_year"
                                                name="graduation_year"
                                                type="number"
                                                inputMode="numeric"
                                                value={formData.graduation_year}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 2025"
                                                className="text-base"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="course" className="text-sm font-medium">
                                            Course *
                                        </Label>
                                        <Input
                                            id="course"
                                            name="course"
                                            value={formData.course}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Computer Science"
                                            className="text-base"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="religion" className="text-sm font-medium">
                                            Religion <span className="text-gray-400">(optional)</span>
                                        </Label>
                                        <Input
                                            id="religion"
                                            name="religion"
                                            value={formData.religion}
                                            onChange={handleInputChange}
                                            placeholder="Your religion"
                                            className="text-base"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Preferences */}
                            {step === 2 && (
                                <div className="space-y-5">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                                            Your Preferences
                                        </h2>
                                        <p className="text-sm text-gray-500 mb-6">
                                            Help us find your perfect match
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">
                                            Gender Preference *
                                        </Label>
                                        <Select
                                            value={preferences.gender_preference}
                                            onValueChange={(value) =>
                                                setPreferences({ ...preferences, gender_preference: value })
                                            }
                                        >
                                            <SelectTrigger className="text-base">
                                                <SelectValue placeholder="Select gender preference" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="both">Both</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">
                                            Education Preference <span className="text-gray-400">(optional)</span>
                                        </Label>
                                        <Input
                                            value={preferences.education_preference}
                                            onChange={(e) =>
                                                setPreferences({
                                                    ...preferences,
                                                    education_preference: e.target.value,
                                                })
                                            }
                                            placeholder="e.g., Bachelor's, Master's"
                                            className="text-base"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Photos */}
                            {step === 3 && (
                                <div className="space-y-5">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                                            Upload Your Photos
                                        </h2>
                                        <p className="text-sm text-gray-500 mb-6">
                                            Add at least one photo. The first one will be your profile picture.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handlePhotoUpload}
                                                className="hidden"
                                                id="photo-upload"
                                                required
                                            />
                                            <label
                                                htmlFor="photo-upload"
                                                className="cursor-pointer block"
                                            >
                                                <div className="text-4xl mb-2">📸</div>
                                                <p className="text-sm font-medium text-gray-700 mb-1">
                                                    Tap to upload photos
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    You can select multiple images
                                                </p>
                                            </label>
                                        </div>

                                        {photos.length > 0 && (
                                            <div className="bg-pink-50 rounded-lg p-4">
                                                <p className="text-sm font-medium text-pink-900">
                                                    ✓ {photos.length} photo(s) selected
                                                </p>
                                                <div className="mt-2 space-y-1">
                                                    {Array.from(photos).map((photo, index) => (
                                                        <p key={index} className="text-xs text-pink-700 truncate">
                                                            {index === 0 && '⭐ '}{photo.name}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Interests */}
                            {step === 4 && (
                                <div className="space-y-5">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                                            Your Interests
                                        </h2>
                                        <p className="text-sm text-gray-500 mb-6">
                                            Select things you're passionate about
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
                                        {allInterests.map((interest) => (
                                            <div
                                                key={interest.id}
                                                className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${selectedInterests.includes(interest.id)
                                                    ? 'border-pink-500 bg-pink-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <Checkbox
                                                    id={`interest-${interest.id}`}
                                                    checked={selectedInterests.includes(interest.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedInterests([
                                                                ...selectedInterests,
                                                                interest.id,
                                                            ]);
                                                        } else {
                                                            setSelectedInterests(
                                                                selectedInterests.filter(
                                                                    (id) => id !== interest.id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                                <Label
                                                    htmlFor={`interest-${interest.id}`}
                                                    className="text-sm cursor-pointer flex-1"
                                                >
                                                    {interest.interest_name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedInterests.length > 0 && (
                                        <div className="bg-pink-50 rounded-lg p-4">
                                            <p className="text-sm font-medium text-pink-900">
                                                {selectedInterests.length} interest(s) selected
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Fixed Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:p-6 z-10">
                <div className="max-w-2xl mx-auto flex gap-3">
                    {step > 1 && (
                        <Button
                            variant="outline"
                            className="flex-1 h-12 text-base font-medium"
                            onClick={() => setStep(step - 1)}
                        >
                            Back
                        </Button>
                    )}
                    {step < 4 ? (
                        <Button
                            className="flex-1 h-12 text-base font-medium bg-pink-600 hover:bg-pink-700"
                            onClick={() => setStep(step + 1)}
                            disabled={
                                (step === 1 && !formData.bio) ||
                                (step === 3 && photos.length === 0)
                            }
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            className="flex-1 h-12 text-base font-medium bg-pink-600 hover:bg-pink-700"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </span>
                            ) : (
                                'Complete Profile'
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}