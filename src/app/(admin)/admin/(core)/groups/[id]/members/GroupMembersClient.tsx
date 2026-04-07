"use client";

import { useParams } from "next/navigation";
import GroupMembers from "@/components/Features/Core/Groups/Admin/GroupMembers";

export default function AdminGroupMembersClient() {
    const params = useParams();
    const groupId = Number(params.id);

    return (
        <div className="w-full p-4">
            <GroupMembers groupId={groupId} />
        </div>
    );
}
