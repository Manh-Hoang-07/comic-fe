"use client";

import { useState, useCallback, useEffect } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminHeader } from "./header";

export function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    // Lock body scroll on mobile when sidebar is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Mobile Overlay - rendered before sidebar so sidebar is on top */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            <div className="flex-1 flex flex-col min-w-0 h-full">
                {/* Fixed Header */}
                <AdminHeader onToggleSidebar={toggleSidebar} />

                {/* Main Content with its own scrollbar */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
                    <div className="w-full mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}


