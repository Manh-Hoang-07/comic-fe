import Link from "next/link";
import Image from "next/image";
import { SystemConfig } from "@/types/api";

interface PublicFooterProps {
  systemConfig: SystemConfig | null;
}

export function PublicFooter({ systemConfig }: PublicFooterProps) {
  const systemInfo = {
    name: systemConfig?.site_name || "Hệ thống",
    version: (systemConfig as Record<string, unknown>)?.version as string || "1.0.0",
    timezone: systemConfig?.timezone || "Asia/Ho_Chi_Minh",
  };

  const siteCopyright = systemConfig?.site_copyright || null;
  const siteDescription = systemConfig?.site_description || null;
  const siteEmail = systemConfig?.site_email || null;
  const sitePhone = systemConfig?.site_phone || null;
  const siteAddress = systemConfig?.site_address || null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                {systemConfig?.site_logo ? (
                  <Image
                    src={systemConfig.site_logo}
                    alt={systemInfo.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-semibold">{systemInfo.name}</h3>
            </div>
            <p className="text-gray-400 mb-4">{siteDescription}</p>
            <div className="space-y-2 text-sm text-gray-400">
              {siteAddress && (
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">📍</span>
                  <span>{siteAddress}</span>
                </div>
              )}
              {sitePhone && (
                <div className="flex items-center gap-2">
                  <span className="text-primary">📞</span>
                  <span>{sitePhone}</span>
                </div>
              )}
              {siteEmail && (
                <div className="flex items-center gap-2">
                  <span className="text-primary">✉️</span>
                  <span>{siteEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Projects & Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Dự án & Dịch vụ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  Dự án nổi bật
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Thư viện ảnh
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-white transition-colors">
                  Chứng chỉ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/staff" className="hover:text-white transition-colors">
                  Đội ngũ
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-white transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* System Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Thông tin hệ thống</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Phiên bản: {systemInfo.version}
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Múi giờ: {systemInfo.timezone}
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            {siteCopyright || `© ${currentYear} ${systemInfo.name}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}

