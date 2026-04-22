import { Metadata } from "next";
import RegisterForm from "@/components/Features/Auth/Register/RegisterForm";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản | Comic Haven",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
