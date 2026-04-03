import { Metadata } from "next";
import PageMeta from "@/components/UI/Navigation/PageMeta";
import AdminGroupMembersClient from "./GroupMembersClient";

export const metadata: Metadata = {
  title: "Thành viên nhóm | Admin",
  description: "Quản lý thành viên trong nhóm",
};

export default function AdminGroupMembersPage() {
  return (
    <>
      <PageMeta
        title="Thành viên nhóm"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Nhóm & Context", href: "/admin/groups" },
          { label: "Nhóm", href: "/admin/groups" },
          { label: "Thành viên" },
        ]}
      />
      <AdminGroupMembersClient />
    </>
  );
}
