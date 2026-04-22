import { getAboutSections, getStaffList } from "@/lib/api/public/general";
import { Metadata } from "next";
import AboutContent from "@/components/Features/Introduction/About/Public/AboutContent";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description: "Tìm hiểu thêm về đội ngũ và giá trị cốt lõi của chúng tôi.",
};

export default async function AboutPage() {
  const [aboutSections, allStaff] = await Promise.all([
    getAboutSections(),
    getStaffList()
  ]);
  const teamMembers = allStaff.slice(0, 3);
  return <AboutContent aboutSections={aboutSections} teamMembers={teamMembers} />;
}
