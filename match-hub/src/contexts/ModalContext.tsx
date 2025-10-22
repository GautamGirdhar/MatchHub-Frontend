"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";

type GeneralModalContent = Partial<{
    heading: string;
    description: string;
    buttonName: string;
    buttonHref: string;
    icon: ReactNode;
}>;

type SubscriptionModalContent = Partial<{
    planName: string;
    message: string;
    ctaText: string;
    ctaHref: string;
}>;

type CombinedModalContextType = {
    // General modal
    isGeneralOpen: boolean;
    modalContent: GeneralModalContent | null;
    openGeneralModal: (content: GeneralModalContent) => void;
    closeGeneralModal: () => void;

    // Feedback modal
    isFeedbackOpen: boolean;
    openFeedbackModal: (preset?: string) => void;
    closeFeedbackModal: () => void;

    // Loading modal
    isLoading: boolean;
    openLoadingModal: (message?: string) => void;
    closeLoadingModal: () => void;
    loadingMessage: string | null;

    // Subscription modal (for limits / upsell)
    isSubscriptionOpen: boolean;
    subscriptionContent: SubscriptionModalContent | null;
    openSubscriptionModal: (content?: SubscriptionModalContent) => void;
    closeSubscriptionModal: () => void;

    // helper: open subscription when limits reached
    handleLimitsReached: (reason?: string) => void;
};

const defaultFn = () => { };
const ModalContext = createContext<CombinedModalContextType>({
    isGeneralOpen: false,
    modalContent: null,
    openGeneralModal: defaultFn,
    closeGeneralModal: defaultFn,

    isFeedbackOpen: false,
    openFeedbackModal: defaultFn,
    closeFeedbackModal: defaultFn,

    isLoading: false,
    openLoadingModal: defaultFn,
    closeLoadingModal: defaultFn,
    loadingMessage: null,

    isSubscriptionOpen: false,
    subscriptionContent: null,
    openSubscriptionModal: defaultFn,
    closeSubscriptionModal: defaultFn,

    handleLimitsReached: defaultFn,
});

export function useModalContext() {
    return useContext(ModalContext);
}
export function useGeneralModal() {
    const ctx = useContext(ModalContext);
    return {
        isOpen: ctx.isGeneralOpen,
        content: ctx.modalContent,
        open: ctx.openGeneralModal,
        close: ctx.closeGeneralModal,
    };
}
export function useFeedbackModal() {
    const ctx = useContext(ModalContext);
    return {
        isOpen: ctx.isFeedbackOpen,
        open: ctx.openFeedbackModal,
        close: ctx.closeFeedbackModal,
    };
}
export function useLoadingModal() {
    const ctx = useContext(ModalContext);
    return {
        isLoading: ctx.isLoading,
        message: ctx.loadingMessage,
        open: ctx.openLoadingModal,
        close: ctx.closeLoadingModal,
    };
}
export function useSubscriptionModal() {
    const ctx = useContext(ModalContext);
    return {
        isOpen: ctx.isSubscriptionOpen,
        content: ctx.subscriptionContent,
        open: ctx.openSubscriptionModal,
        close: ctx.closeSubscriptionModal,
    };
}

export function ModalContextProvider({ children }: { children: ReactNode }) {
    // General modal state
    const [isGeneralOpen, setIsGeneralOpen] = useState(false);
    const [modalContent, setModalContent] =
        useState<GeneralModalContent | null>(null);

    // Feedback modal state
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    // Loading modal state
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

    // Subscription/limits modal state
    const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
    const [subscriptionContent, setSubscriptionContent] =
        useState<SubscriptionModalContent | null>(null);

    const openGeneralModal = useCallback((content: GeneralModalContent) => {
        setModalContent(content);
        setIsGeneralOpen(true);
    }, []);

    const closeGeneralModal = useCallback(() => {
        setModalContent(null);
        setIsGeneralOpen(false);
    }, []);

    const openFeedbackModal = useCallback((_preset?: string) => {
        // preset can be used to show different feedback flows (report, bug, etc.)
        setIsFeedbackOpen(true);
    }, []);

    const closeFeedbackModal = useCallback(() => {
        setIsFeedbackOpen(false);
    }, []);

    const openLoadingModal = useCallback((message?: string) => {
        setLoadingMessage(message ?? null);
        setIsLoading(true);
    }, []);

    const closeLoadingModal = useCallback(() => {
        setIsLoading(false);
        setLoadingMessage(null);
    }, []);

    const openSubscriptionModal = useCallback((content?: SubscriptionModalContent) => {
        setSubscriptionContent(
            content ?? {
                planName: "Pro",
                message: "You've reached a usage limit. Upgrade to continue.",
                ctaText: "View plans",
                ctaHref: "/subscribe",
            }
        );
        setIsSubscriptionOpen(true);
    }, []);

    const closeSubscriptionModal = useCallback(() => {
        setSubscriptionContent(null);
        setIsSubscriptionOpen(false);
    }, []);

    const handleLimitsReached = useCallback((reason?: string) => {
        // lightweight helper to surface subscription modal when user hits limits.
        // reason can be used for analytics or to alter the message.
        openSubscriptionModal({
            message:
                reason ??
                "You've reached your free quota. Upgrade to continue enjoying MatchHub features.",
            ctaText: "Upgrade now",
            ctaHref: "/subscribe",
        });
    }, [openSubscriptionModal]);

    const value: CombinedModalContextType = {
        isGeneralOpen,
        modalContent,
        openGeneralModal,
        closeGeneralModal,

        isFeedbackOpen,
        openFeedbackModal,
        closeFeedbackModal,

        isLoading,
        openLoadingModal,
        closeLoadingModal,
        loadingMessage,

        isSubscriptionOpen,
        subscriptionContent,
        openSubscriptionModal,
        closeSubscriptionModal,

        handleLimitsReached,
    };

    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}