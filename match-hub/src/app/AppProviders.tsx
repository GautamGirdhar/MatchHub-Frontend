"use client";

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dynamic from "next/dynamic";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationContextProvider } from "@/contexts/NotificationContext";
import { ModalContextProvider } from "@/contexts/ModalContext";
import Modals from "@/components/Modals";

// Lazy load Toaster for client-side only
const Toaster = dynamic(
    () => import("react-hot-toast").then((c) => c.Toaster),
    { ssr: false }
);

// Configure React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

interface AppProvidersProps {
    children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>

                    <NotificationContextProvider>
                        <ModalContextProvider>
                            <>
                                <Modals />
                                {children}
                                {mounted && (
                                    <Toaster
                                        position="top-right"
                                        toastOptions={{
                                            duration: 3000,
                                            style: {
                                                background: "#363636",
                                                color: "#fff",
                                            },
                                            success: {
                                                duration: 3000,
                                                iconTheme: {
                                                    primary: "#4ade80",
                                                    secondary: "#fff",
                                                },
                                            },
                                            error: {
                                                duration: 4000,
                                                iconTheme: {
                                                    primary: "#ef4444",
                                                    secondary: "#fff",
                                                },
                                            },
                                        }}
                                    />
                                )}
                            </>
                        </ModalContextProvider>
                    </NotificationContextProvider>

                </AuthProvider>
                {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
            </QueryClientProvider>
        </CookiesProvider>
    );
}