import { Metadata } from "next";
import { getSystemConfig } from "@/lib/api/public/general";
import { SystemConfig } from "@/types/api";
import ContactPageContent from "@/components/Features/Introduction/Contacts/Public/ContactPageContent";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất.",
};

export default async function ContactPage() {
  const config = await getSystemConfig("general") as SystemConfig || {};
  return <ContactPageContent config={config} />;
}
