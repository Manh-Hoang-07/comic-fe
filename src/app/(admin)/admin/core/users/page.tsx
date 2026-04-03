import { Metadata } from "next";
import UsersClient from "./UsersClient";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý thành viên | Admin",
  description: "Quản lý danh sách người dùng và phân quyền",
};

export default function AdminUsersPage() {
  return (
    <>
      <PageMeta
        title="Quản lý thành viên"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Thành viên", href: "/admin/users" },
        ]}
      />
      <UsersClient />
    </>
  );
}


