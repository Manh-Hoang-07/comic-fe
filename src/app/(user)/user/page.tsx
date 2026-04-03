import { Metadata } from "next";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Khu vực cá nhân | User",
  description: "Trang tổng quan người dùng",
};

export default function UserIndexPage() {
  return (
    <div className="w-full px-6 py-10">
      <PageMeta
        title="Khu vực cá nhân"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Cá nhân" },
        ]}
      />
      <h1 className="text-2xl font-semibold text-zinc-900">Khu vực người dùng</h1>
      <p className="mt-2 text-zinc-600">
        Skeleton cho <code>/user</code> – tương ứng với các route trong{" "}
        <code>pages/user/**</code> bên Nuxt.
      </p>
    </div>
  );
}









