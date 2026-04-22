import { Metadata } from "next";
import ForgotPasswordForm from "@/components/Features/Auth/ForgotPassword/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Quên mật khẩu | Comic Haven",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
