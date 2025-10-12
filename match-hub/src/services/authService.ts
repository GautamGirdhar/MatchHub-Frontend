import api from "@/lib/api";
import {
    getToken,
    setToken,
    setRefreshToken,
    setUser,
    getUser,
    clearAllCookies,
    isAuthenticated as checkAuth
} from "@/utils/auth";

export interface SignupData {
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
    date_of_birth: string;
    gender: "M" | "F" | "O";
    phone_number?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    phone_number?: string;
    created_at: string;
    is_active: boolean;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: User;
}

export const authService = {
    async signup(data: SignupData): Promise<User> {
        const response = await api.post("/users/signup", data);
        return response.data;
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/users/login", data);
        const { access_token, refresh_token, user } = response.data;

        // Store tokens and user in cookies
        setToken(access_token);
        setRefreshToken(refresh_token);
        setUser(user);

        return response.data;
    },

    async logout(): Promise<void> {
        try {
            await api.post("/users/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            clearAllCookies();
        }
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get<User>("/users/me");
        setUser(response.data);
        return response.data;
    },

    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        await api.put("/users/change-password", {
            old_password: oldPassword,
            new_password: newPassword,
        });
    },

    async checkEmail(email: string): Promise<boolean> {
        const response = await api.get(`/users/check-email/${email}`);
        return response.data.available;
    },

    getStoredUser(): User | null {
        return getUser();
    },

    isAuthenticated(): boolean {
        return checkAuth();
    },

    getAccessToken(): string | undefined {
        return getToken();
    },
};