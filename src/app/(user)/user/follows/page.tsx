import { Metadata } from "next";
import PageMeta from "@/components/UI/Navigation/PageMeta";
import UserFollows from "@/components/Features/Core/Users/User/Follows/UserFollows";

export const metadata: Metadata = {
  title: "Đang theo dõi | User",
  description: "Trang quản lý danh sách theo dõi",
};

export default function UserFollowsPage() {
  return (
    <>
      <PageMeta
        title="Đang theo dõi"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Cá nhân", href: "/user" },
          { label: "Theo dõi" },
        ]}
      />
      <UserFollows />
    </>
  );
}


