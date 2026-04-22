import { Metadata } from "next";
import LoginForm from "@/components/Features/Auth/Login/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập | Comic Haven",
};

export default function LoginPage() {
  return <LoginForm />;
}
