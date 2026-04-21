"use client";

import React, { useState, useEffect, useMemo, isValidElement } from "react";
import { usePathname } from "next/navigation";
import FloatingContactChannels from "@/components/Layouts/Public/contact-channels/FloatingContactChannels";
import { BackToTop } from "@/components/UI/Navigation/BackToTop";

interface PublicLayoutWrapperProps {
    children: React.ReactNode;
    header: React.ReactNode;
    footer: React.ReactNode;
    contactChannels: unknown;
}

export function PublicLayoutWrapper({
    children,
    header,
    footer,
    contactChannels,
}: PublicLayoutWrapperProps) {
    const pathname = usePathname();
    const isReadingPage = pathname?.includes("/chapters/");

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <React.Fragment key="header-section">{header}</React.Fragment>

            {/* Main Content */}
            <main
                key="main-content"
                className={`flex-1 min-h-screen ${isReadingPage ? 'pt-0' : 'pt-20'}`}
            >
                {children}
            </main>

            {!isReadingPage && <React.Fragment key="footer-section">{footer}</React.Fragment>}
            {!isReadingPage && <FloatingContactChannels key="floating-channels" channels={contactChannels as Parameters<typeof FloatingContactChannels>[0]["channels"]} />}
            {!isReadingPage && <BackToTop />}
        </div>
    );
}


