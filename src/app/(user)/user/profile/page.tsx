import { Metadata } from "next";
import PageMeta from "@/components/UI/Navigation/PageMeta";
import UserProfileClient from "./UserProfileClient";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân | User",
  description: "Quản lý thông tin cá nhân",
};

export default function UserProfilePage() {
  return (
    <>
      <PageMeta
        title="Hồ sơ cá nhân"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Cá nhân", href: "/user" },
          { label: "Hồ sơ" },
        ]}
      />
      <UserProfileClient />
    </>
  );
}

