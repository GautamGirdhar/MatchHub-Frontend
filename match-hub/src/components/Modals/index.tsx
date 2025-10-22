"use client";

import React from "react";
import GeneralModal from "./GeneralModal";
import FeedbackModal from "./FeedbackModal";
import LoadingScreen from "./LoadingModal";
import SubscriptionModal from "./SubscriptionModal";
import { useModalContext } from "@/contexts/ModalContext";

const Modals: React.FC = () => {
    const {
        isGeneralOpen,
        isFeedbackOpen,
        isLoading,
        isSubscriptionOpen,
    } = useModalContext();

    return (
        <>
            {isGeneralOpen && <GeneralModal />}
            {isFeedbackOpen && <FeedbackModal />}
            {isLoading && <LoadingScreen />}
            {isSubscriptionOpen && <SubscriptionModal />}
        </>
    );
};

export default Modals;
export { GeneralModal, FeedbackModal, LoadingScreen, SubscriptionModal };