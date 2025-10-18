import api from '@/lib/api';

export interface ProfileStatus {
    is_completed: boolean;
    has_photos: boolean;
    has_primary_photo: boolean;
    completion_percentage: number;
}

export interface Profile {
    bio?: string;
    looking_for?: string;
    height_cm?: number;
    course?: string;
    graduation_year?: number;
    religion?: string;
    is_completed: boolean;
    updated_at: string;
}

export interface Preferences {
    gender_preference: string;
    education_preference?: string;
    updated_at?: string; // Make this optional with ?
}
export interface Interest {
    id: number;
    interest_name: string;
    category: string;
}

export interface CompleteProfile {
    user: {
        email: string;
        first_name: string;
        last_name: string;
        date_of_birth: string;
        gender: string;
        college_registration_number: string;
    };
    profile: Profile;
    preferences: Preferences;
    photos: ProfilePhoto[];
    interests: Interest[];
}

export interface ProfilePhoto {
    id: number;
    photo: string;
    is_primary: boolean;
    display_order: number;
    uploaded_at: string;
}

export const profileService = {
    // Check profile status
    async checkStatus(): Promise<ProfileStatus> {
        const response = await api.get('/profiles/status');
        return response.data;
    },

    // Get profile
    async getProfile(): Promise<Profile> {
        const response = await api.get('/profiles/me');
        return response.data;
    },

    // Update profile
    async updateProfile(data: Partial<Profile>): Promise<Profile> {
        const response = await api.put('/profiles/me', data);
        return response.data;
    },

    // Get preferences
    async getPreferences(): Promise<Preferences> {
        const response = await api.get('/profiles/preferences');
        return response.data;
    },

    // Update preferences
    async updatePreferences(data: Preferences): Promise<Preferences> {
        const response = await api.put('/profiles/preferences', data);
        return response.data;
    },

    // Upload photo
    async uploadPhoto(file: File, isPrimary: boolean = false) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('is_primary', isPrimary.toString());

        const response = await api.post('/profiles/photos', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get photos
    async getPhotos() {
        const response = await api.get('/profiles/photos');
        return response.data;
    },

    // Delete photo
    async deletePhoto(photoId: number) {
        const response = await api.delete(`/profiles/photos/${photoId}`);
        return response.data;
    },

    // Set primary photo
    async setPrimaryPhoto(photoId: number) {
        const response = await api.put(`/profiles/photos/${photoId}/primary`);
        return response.data;
    },

    // Get all interests
    async getAllInterests(): Promise<Interest[]> {
        const response = await api.get('/profiles/interests/all');
        return response.data;
    },

    // Get user's interests
    async getMyInterests(): Promise<Interest[]> {
        const response = await api.get('/profiles/interests/me');
        return response.data;
    },

    // Add interests
    async addInterests(interestIds: number[]) {
        const response = await api.post('/profiles/interests/me', {
            interest_ids: interestIds,
        });
        return response.data;
    },

    // Get complete profile
    async getCompleteProfile(): Promise<CompleteProfile> {
        const response = await api.get('/profiles/me/complete');
        return response.data;
    },

    // Reorder photos
    async reorderPhotos(photoOrders: Array<{ id: number; display_order: number }>) {
        const response = await api.put('/profiles/photos/reorder', {
            photo_orders: photoOrders,
        });
        return response.data;
    },

    // Update photo
    async updatePhoto(photoId: number, data: { is_primary?: boolean; display_order?: number }) {
        const response = await api.patch(`/profiles/photos/${photoId}`, data);
        return response.data;
    },
};