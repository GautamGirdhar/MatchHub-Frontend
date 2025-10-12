import Cookies from "js-cookie";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from "./constants";
import { User } from '@/services/authService'

export function getToken(): string | undefined {
    return Cookies.get(ACCESS_TOKEN_KEY);
}

export function setToken(token: string): string | undefined {
    return Cookies.set(ACCESS_TOKEN_KEY, token, {
        expires: 1, // 1 day
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });
}

export function getRefreshToken(): string | undefined {
    return Cookies.get(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): string | undefined {
    return Cookies.set(REFRESH_TOKEN_KEY, token, {
        expires: 7, // 7 days
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });
}

export function getUser(): User | null {
    const userStr = Cookies.get(USER_KEY);
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

export function setUser(user: User): void {
    Cookies.set(USER_KEY, JSON.stringify(user), {
        expires: 7, // 7 days
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });
}

export function clearAllCookies(): void {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USER_KEY);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}