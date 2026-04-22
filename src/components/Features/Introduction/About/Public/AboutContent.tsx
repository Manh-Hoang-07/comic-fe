import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/UI/Navigation/Button";
import { AboutSection, TeamMember } from "@/types/api";
import HeroBanner from "@/components/Features/Marketing/Banners/Public/HeroBanner";
import { Breadcrumbs } from "@/components/UI/Navigation/Breadcrumbs";

interface AboutContentProps {
  aboutSections: AboutSection[];
  teamMembers: TeamMember[];
}

export default function AboutContent({ aboutSections, teamMembers }: AboutContentProps) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] transition-colors duration-300">
      <HeroBanner locationCode="about" imageOnly={true} />

      <div className="container mx-auto px-4 mt-8 relative z-10">
        <Breadcrumbs items={[{ label: "Về chúng tôi" }]} />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-l-8 border-primary pl-6">Về chúng tôi</h1>

        {/* About Sections */}
        <div className="space-y-12 mb-16">
          {aboutSections.length > 0 ? (
            aboutSections.map((section: AboutSection, index: number) => (
              <div key={section.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8`}>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h3>
                  <div
                    className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
                <div className="flex-1">
                  {section.image && (
                    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                      <Image
                        src={section.image}
                        alt={section.title}
                        width={800}
                        height={400}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Thông tin giới thiệu đang được cập nhật...</p>
          )}
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Đội ngũ của chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member: TeamMember) => (
              <div key={member.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 group">
                <div className="h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {member.avatar ? (
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 mb-4 line-clamp-3">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Gia nhập đội ngũ của chúng tôi</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Chúng tôi luôn tìm kiếm những tài năng mới để cùng nhau phát triển.
            Nếu bạn đam mê và muốn tạo ra sự khác biệt, hãy liên hệ với chúng tôi.
          </p>
          <Link href="/contact">
            <Button size="lg">
              Liên hệ ngay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
