"use client";

import { useState, useCallback } from "react";
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

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 relative">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm"
                    onClick={closeSidebar}
                />
            )}

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


