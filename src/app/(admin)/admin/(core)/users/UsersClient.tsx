"use client";

import dynamic from "next/dynamic";

const AdminUsers = dynamic(() => import("@/components/Features/Core/Users/Admin/AdminUsers"), {
    ssr: false,
    loading: () => <div>Đang tải...</div>,
});

export default function UsersClient() {
    return (
        <div className="w-full p-4">
            <AdminUsers />
        </div>
    );
}


