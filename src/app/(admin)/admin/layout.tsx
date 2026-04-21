import { Suspense } from "react";
import { constructMetadata } from "@/lib/metadata";
import { AdminLayoutClient } from "@/components/Layouts/Admin/AdminLayoutClient";
import ErrorBoundary from "@/components/UI/Feedback/ErrorBoundary";

export const metadata = constructMetadata({
    title: "Admin Dashboard",
    description: "Manage your website content",
    noIndex: true,
});

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={null}>
            <AdminLayoutClient>
                <ErrorBoundary>{children}</ErrorBoundary>
            </AdminLayoutClient>
        </Suspense>
    );
}


