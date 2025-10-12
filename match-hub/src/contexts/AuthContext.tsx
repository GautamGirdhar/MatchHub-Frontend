"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, authService } from "@/services/authService";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated on mount
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
            setUser(storedUser);
            // Optionally refresh user data from server
            authService.getCurrentUser()
                .then(setUser)
                .catch(() => setUser(null));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        setUser(response.user);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        router.push("/login");
    };

    const refreshUser = async () => {
        try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user && authService.isAuthenticated(),
                login,
                logout,
                refreshUser,
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