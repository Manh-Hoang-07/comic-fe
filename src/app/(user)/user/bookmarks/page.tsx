import { Metadata } from "next";
import PageMeta from "@/components/UI/Navigation/PageMeta";
import UserBookmarks from "@/components/Features/Core/Users/User/Bookmarks/UserBookmarks";

export const metadata: Metadata = {
  title: "Đánh dấu của tôi | User",
  description: "Trang quản lý bookmark bài viết",
};

export default function UserBookmarksPage() {
  return (
    <>
      <PageMeta
        title="Đánh dấu của tôi"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Cá nhân", href: "/user" },
          { label: "Đánh dấu" },
        ]}
      />
      <UserBookmarks />
    </>
  );
}


