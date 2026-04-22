import { Metadata } from "next";
import ChangePasswordForm from "@/components/Features/Core/Users/User/Profile/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Đổi mật khẩu | User",
};

export default function ChangePasswordPage() {
  return <ChangePasswordForm />;
}
