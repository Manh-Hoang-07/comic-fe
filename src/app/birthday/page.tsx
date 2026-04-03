import { Metadata } from "next";
import BirthdayContent from "@/components/Shared/Birthday/BirthdayContent";

export const metadata: Metadata = {
    title: "Chúc Mừng Sinh Nhật 1 Tuổi - Vũ Gia Huy",
    description: "Kỷ niệm hành trình một năm đầu đời của Vũ Gia Huy - 24/01/2025",
    openGraph: {
        title: "Chúc Mừng Sinh Nhật 1 Tuổi - Vũ Gia Huy",
        description: "Kỷ niệm hành trình một năm đầu đời của Vũ Gia Huy - 24/01/2025",
        url: "/birthday",
        siteName: "Vũ Gia Huy Birthday",
        images: [
            {
                url: "/images/baby_1.jpg",
                width: 1200,
                height: 630,
                alt: "Chúc Mừng Sinh Nhật Vũ Gia Huy",
            },
        ],
        locale: "vi_VN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Chúc Mừng Sinh Nhật 1 Tuổi - Vũ Gia Huy",
        description: "Kỷ niệm hành trình một năm đầu đời của Vũ Gia Huy - 24/01/2025",
        images: ["/images/baby_1.jpg"],
    },
};

export default function BirthdayPage() {
    return <BirthdayContent />;
}
