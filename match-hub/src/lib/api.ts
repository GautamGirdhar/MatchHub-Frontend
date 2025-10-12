import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { getToken, getRefreshToken, setToken, setRefreshToken, clearAllCookies } from "../utils/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const response = await axios.post(`${API_BASE_URL}/users/refresh`, {
                    refresh_token: refreshToken,
                });

                const { access_token, refresh_token: newRefreshToken } = response.data;

                setToken(access_token);
                if (newRefreshToken) {
                    setRefreshToken(newRefreshToken);
                }

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                }

                return api(originalRequest);
            } catch (refreshError) {
                clearAllCookies();
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Custom request function
export function authRequest(config: AxiosRequestConfig) {
    const token = getToken();
    config.headers = config.headers || {};
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return axios(config);
}

// Default export
export default api;