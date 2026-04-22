import { Metadata } from "next";
import PageMeta from "@/components/UI/Navigation/PageMeta";
import UserReadingHistory from "@/components/Features/Core/Users/User/ReadingHistory/UserReadingHistory";

export const metadata: Metadata = {
  title: "Lịch sử đọc | User",
  description: "Trang lịch sử đã xem",
};

export default function UserReadingHistoryPage() {
  return (
    <>
      <PageMeta
        title="Lịch sử đọc"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Cá nhân", href: "/user" },
          { label: "Lịch sử" },
        ]}
      />
      <UserReadingHistory />
    </>
  );
}


