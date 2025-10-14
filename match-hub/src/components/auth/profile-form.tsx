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

            await checkProfileCompletion();
            router.push('/');
        } catch (error) {
            console.error('Failed to complete profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-pink-50 to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-5xl">
                <Card className="p-2 sm:p-2 md:p-10 shadow-xl rounded-2xl">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center sm:text-left">Complete Your Profile</h1>
                    <p className="text-gray-600 mb-6">
                        {profileStatus && `${profileStatus.completion_percentage}% complete`}
                    </p>

                    <Progress value={(step / 4) * 100} className="mb-6" />

                    <CardContent className="space-y-8">
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Basic Information</h2>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Tell us about yourself..."
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="looking_for">Looking For</Label>
                                    <Select
                                        value={formData.looking_for}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, looking_for: value })
                                        }
                                    >
                                        <SelectTrigger id="looking_for">
                                            <SelectValue placeholder="Looking for something special?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="friendship">Friendship</SelectItem>
                                            <SelectItem value="serious_relationship">Serious Relationship</SelectItem>
                                            <SelectItem value="casual">Casual Dating</SelectItem>
                                            <SelectItem value="long_term">Long-term Connection</SelectItem>
                                            <SelectItem value="networking">Networking</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>


                                <div className="space-y-2">
                                    <Label htmlFor="height_cm">Height (cm)</Label>
                                    <Input
                                        id="height_cm"
                                        name="height_cm"
                                        type="number"
                                        value={formData.height_cm}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="course">Course</Label>
                                    <Input
                                        id="course"
                                        name="course"
                                        value={formData.course}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Computer Science"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="graduation_year">Graduation Year</Label>
                                    <Input
                                        id="graduation_year"
                                        name="graduation_year"
                                        type="number"
                                        value={formData.graduation_year}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 2025"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="religion">Religion (optional)</Label>
                                    <Input
                                        id="religion"
                                        name="religion"
                                        value={formData.religion}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <Button onClick={() => setStep(2)} className="w-full">
                                    Next
                                </Button>
                            </div>
                        )}

                        {/* Step 2: Preferences */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Preferences</h2>

                                <div className="space-y-2">
                                    <Label>Gender Preference</Label>
                                    <Select
                                        value={preferences.gender_preference}
                                        onValueChange={(value) =>
                                            setPreferences({ ...preferences, gender_preference: value })
                                        }
                                    >
                                        <SelectTrigger>
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
                                    <Label>Education Preference</Label>
                                    <Input
                                        value={preferences.education_preference}
                                        onChange={(e) =>
                                            setPreferences({
                                                ...preferences,
                                                education_preference: e.target.value,
                                            })
                                        }
                                        placeholder="Optional"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setStep(1)}
                                    >
                                        Back
                                    </Button>
                                    <Button className="flex-1" onClick={() => setStep(3)}>
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Photos */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Upload Photos</h2>
                                <p className="text-sm text-gray-600">
                                    Upload at least one photo. The first photo will be your primary photo.
                                </p>

                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoUpload}
                                    required
                                />

                                {photos.length > 0 && (
                                    <p className="text-sm text-gray-500">
                                        {photos.length} photo(s) selected
                                    </p>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setStep(2)}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        onClick={() => setStep(4)}
                                        disabled={photos.length === 0}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Interests */}
                        {step === 4 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Select Your Interests</h2>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {allInterests.map((interest) => (
                                        <div key={interest.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={selectedInterests.includes(interest.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedInterests([
                                                            ...selectedInterests,
                                                            interest.id,
                                                        ]);
                                                    } else {
                                                        setSelectedInterests(
                                                            selectedInterests.filter((id) => id !== interest.id)
                                                        );
                                                    }
                                                }}
                                            />
                                            <Label className="text-sm">{interest.interest_name}</Label>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setStep(3)}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Complete Profile'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
