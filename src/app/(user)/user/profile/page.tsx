import { Metadata } from "next";
import PageMeta from "@/components/UI/Navigation/PageMeta";
import UserProfile from "@/components/Features/Core/Users/User/Profile/UserProfile";

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
      <UserProfile />
    </>
  );
}
