import { Metadata } from "next";
import UserDashboard from "@/components/Features/Core/Users/User/Dashboard/UserDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tài khoản của tôi",
  description: "Quản lý tài khoản cá nhân",
};

export default function UserIndexPage() {
  return <UserDashboard />;
}
