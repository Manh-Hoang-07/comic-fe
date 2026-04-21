import { Metadata } from "next";
import UserDashboardClient from "./UserDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tài khoản của tôi",
  description: "Quản lý tài khoản cá nhân",
};

export default function UserIndexPage() {
  return <UserDashboardClient />;
}









