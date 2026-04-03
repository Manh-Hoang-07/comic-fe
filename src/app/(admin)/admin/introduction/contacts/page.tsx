import { Metadata } from "next";
import PageMeta from "@/components/UI/Navigation/PageMeta";
import AdminContacts from "@/components/Features/Introduction/Contacts/Admin/AdminContacts";

export const metadata: Metadata = {
  title: "Quản lý Liên hệ | Admin",
  description: "Danh sách liên hệ từ khách hàng",
};

export default function AdminContactsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý Liên hệ"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Liên hệ" },
        ]}
      />
      <AdminContacts />
    </div>
  );
}



