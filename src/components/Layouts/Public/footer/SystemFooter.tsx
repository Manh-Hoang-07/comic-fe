"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";

interface SiteInfo {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
}

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

export default function SystemFooter() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  });
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const loadConfig = async () => {
      setIsConfigLoading(true);
      try {
        const response = await api.get(publicEndpoints.systemConfigs.general);
        const config = response.data?.data || response.data || {};

        setSiteInfo({
          name: config.site_name || config.name || "",
          email: config.email || "",
          phone: config.phone || "",
          address: config.address || "",
          description: config.description || "",
        });

        setSocialLinks({
          facebook: config.facebook_url || config.facebook || "",
          twitter: config.twitter_url || config.twitter || "",
          instagram: config.instagram_url || config.instagram || "",
        });
      } catch (err) {
        console.error("Error loading system config:", err);
      } finally {
        setIsConfigLoading(false);
      }
    };

    loadConfig();
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Thông tin công ty */}
          <div>
            <h3 className="text-xl font-bold mb-4">{siteInfo.name || "Company"}</h3>
            {siteInfo.description && (
              <p className="text-gray-300 mb-4">{siteInfo.description}</p>
            )}
            <div className="space-y-2">
              {siteInfo.email && (
                <p className="flex items-center">
                  <span className="mr-2">📧</span>
                  {siteInfo.email}
                </p>
              )}
              {siteInfo.phone && (
                <p className="flex items-center">
                  <span className="mr-2">📞</span>
                  {siteInfo.phone}
                </p>
              )}
              {siteInfo.address && (
                <p className="flex items-center">
                  <span className="mr-2">📍</span>
                  {siteInfo.address}
                </p>
              )}
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Mạng xã hội */}
          {Object.keys(socialLinks).length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Mạng xã hội</h3>
              <div className="flex space-x-4">
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white"
                  >
                    Facebook
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white"
                  >
                    Twitter
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isConfigLoading && (
          <div className="mt-4 text-center">
            <p className="text-gray-400">Đang tải thông tin...</p>
          </div>
        )}

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-gray-400">
            © {currentYear} {siteInfo.name || "Company"}. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}



