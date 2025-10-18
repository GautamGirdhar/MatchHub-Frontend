"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, authService } from "@/services/authService";
import { profileService, ProfileStatus } from "@/services/profileService";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    profileStatus: ProfileStatus | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    checkProfileCompletion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Check profile completion
    const checkProfileCompletion = async () => {
        try {
            const status = await profileService.checkStatus();
            setProfileStatus(status);
        } catch (error) {
            console.error('Failed to check profile status:', error);
        }
    };

    useEffect(() => {
        // Check if user is authenticated on mount
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
            setUser(storedUser);
            // Optionally refresh user data from server
            authService.getCurrentUser()
                .then(async (userData) => {
                    setUser(userData);
                    // Check profile completion after getting user
                    await checkProfileCompletion();
                })
                .catch(() => setUser(null));
        }
        setIsLoading(false);
    }, []);

    // Redirect to profile completion if needed
    useEffect(() => {
        if (!user || !authService.isAuthenticated() || isLoading) return;

        // Routes that don't require profile completion
        const publicRoutes = ['/auth/login', '/auth/signup', '/profile/complete'];
        const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));


    }, [user, profileStatus, pathname, isLoading]);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        setUser(response.user);
        // Check profile completion after login
        await checkProfileCompletion();
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setProfileStatus(null);
        router.push("/auth/login");
    };

    const refreshUser = async () => {
        try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
            // Also refresh profile status
            await checkProfileCompletion();
        } catch (error) {
            setUser(null);
            setProfileStatus(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user && authService.isAuthenticated(),
                profileStatus,
                login,
                logout,
                refreshUser,
                checkProfileCompletion,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}