import { Metadata } from "next";
import { getStaffList } from "@/lib/api/public/general";
import StaffPageContent from "@/components/Features/Introduction/Staff/Public/StaffPageContent";

export const metadata: Metadata = {
  title: "Đội ngũ nhân sự",
  description: "Gặp gỡ đội ngũ chuyên gia tận tâm và giàu kinh nghiệm của chúng tôi.",
};

export default async function StaffPage() {
  const staffMembers = await getStaffList();
  return <StaffPageContent staffMembers={staffMembers} />;
}
