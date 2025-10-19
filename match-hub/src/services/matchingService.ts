import api from '@/lib/api';

export interface UserCard {
    user_id: number;
    first_name: string;
    age: number;
    bio?: string;
    looking_for?: string;
    height_cm?: number;
    course?: string;
    graduation_year?: number;
    religion?: string;
    primary_photo?: string;
    photos: string[];
    interests: string[];
    distance?: number;
    compatibility_score?: number;
}

export interface SwipeAction {
    action: 'like' | 'super_like' | 'pass';
    target_user_id: number;
}

export interface SwipeResult {
    success: boolean;
    action: string;
    is_match: boolean;
    match_id?: number;
    remaining_likes: number;
    remaining_super_likes: number;
    message: string;
}

export interface SwipeLimits {
    daily_likes_limit: number;
    daily_super_likes_limit: number;
    likes_used: number;
    super_likes_used: number;
    remaining_likes: number;
    remaining_super_likes: number;
    unlimited_swipes: boolean;
    next_reset: string;
    passes_used: number;           // Add this
    remaining_passes: number;      // Add this
}

export interface Match {
    match_id: number;
    user: UserCard;
    matched_at: string;
    compatibility_score?: number;
}

export const matchingService = {
    // Get discovery cards
    async getDiscoveryCards(limit: number = 10): Promise<UserCard[]> {
        const response = await api.get(`/matching/discover?limit=${limit}`);
        return response.data;
    },

    // Get swipe limits
    async getSwipeLimits(): Promise<SwipeLimits> {
        const response = await api.get('/matching/limits');
        return response.data;
    },

    // Perform swipe action
    async swipe(action: SwipeAction): Promise<SwipeResult> {
        const response = await api.post('/matching/swipe', action);
        return response.data;
    },

    // Get matches
    async getMatches(): Promise<Match[]> {
        const response = await api.get('/matching/matches');
        return response.data;
    },

    // Unmatch
    async unmatch(matchId: number) {
        const response = await api.delete(`/matching/matches/${matchId}`);
        return response.data;
    },
};