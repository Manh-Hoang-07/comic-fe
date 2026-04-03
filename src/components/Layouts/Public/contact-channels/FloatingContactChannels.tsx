"use client";

import { useState } from "react";
import Image from "next/image";

interface ContactChannel {
  type: string;
  value: string;
  label?: string;
  icon?: string;
  enabled?: boolean;
  sort_order?: number;
  url_template?: string;
}

interface FloatingContactChannelsProps {
  channels?: ContactChannel[] | null;
  showLabel?: boolean;
}

export default function FloatingContactChannels({
  channels = [],
  showLabel = true,
}: FloatingContactChannelsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [failedIcons, setFailedIcons] = useState<Record<number, boolean>>({});

  const enabledChannels = (channels || [])
    .filter((ch) => ch.enabled !== false)
    .sort((a, b) => {
      const orderA = a.sort_order ?? 999;
      const orderB = b.sort_order ?? 999;
      return orderA - orderB;
    });

  const getChannelUrl = (channel: ContactChannel): string => {
    if (channel.url_template && channel.url_template.trim()) {
      return channel.url_template.replace(/{value}/g, channel.value);
    }

    const urlMap: Record<string, string> = {
      hotline: `tel:${channel.value}`,
      zalo: `https://zalo.me/${channel.value}`,
      messenger: `https://m.me/${channel.value}`,
      telegram: `https://t.me/${channel.value.replace(/^@/, "")}`,
      whatsapp: `https://wa.me/${channel.value}`,
    };

    return urlMap[channel.type] || "#";
  };

  const isExternalUrl = (url: string): boolean => {
    if (url.startsWith("tel:") || url.startsWith("mailto:")) return false;
    try {
      const urlObj = new URL(url, typeof window !== "undefined" ? window.location.origin : "");
      return urlObj.origin !== (typeof window !== "undefined" ? window.location.origin : "");
    } catch {
      return false;
    }
  };

  const getChannelClass = (type: string): string => {
    const classMap: Record<string, string> = {
      zalo: "bg-blue-500 hover:bg-blue-600 text-white",
      messenger: "bg-blue-500 hover:bg-blue-600 text-white",
      hotline: "bg-green-500 hover:bg-green-600 text-white",
      telegram: "bg-blue-400 hover:bg-blue-500 text-white",
      whatsapp: "bg-green-500 hover:bg-green-600 text-white",
    };

    return classMap[type] || "bg-gray-600 hover:bg-gray-700 text-white";
  };

  const getDefaultLabel = (type: string): string => {
    const labelMap: Record<string, string> = {
      zalo: "Chat Zalo",
      messenger: "Messenger",
      hotline: "Hotline",
      telegram: "Telegram",
      whatsapp: "WhatsApp",
    };

    return labelMap[type] || type;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (enabledChannels.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[1000]">
      {!isExpanded && (
        <button
          onClick={toggleExpanded}
          className="w-15 h-15 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 relative"
          aria-label="Mở kênh liên hệ"
          title="Kênh liên hệ"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {enabledChannels.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white">
              {enabledChannels.length}
            </span>
          )}
        </button>
      )}

      {isExpanded && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-3 items-end">
          <button
            onClick={toggleExpanded}
            className="w-12 h-12 rounded-full bg-gray-600 text-white border-none shadow-md cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105"
            aria-label="Đóng menu"
            title="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {enabledChannels.map((channel, index) => (
            <a
              key={index}
              href={getChannelUrl(channel)}
              target={isExternalUrl(getChannelUrl(channel)) ? "_blank" : undefined}
              rel={isExternalUrl(getChannelUrl(channel)) ? "noopener noreferrer" : undefined}
              aria-label={channel.label || channel.type}
              title={channel.label || channel.type}
              className={`w-12 h-12 rounded-full border-none shadow-md cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-110 text-decoration-none relative ${getChannelClass(
                channel.type
              )}`}
              onClick={() => {
                if (!getChannelUrl(channel).startsWith("tel:") && !getChannelUrl(channel).startsWith("mailto:")) {
                  setTimeout(() => setIsExpanded(false), 300);
                }
              }}
            >
              {channel.icon && !failedIcons[index] ? (
                <Image
                  src={channel.icon}
                  alt={channel.label || channel.type}
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                  onError={() => {
                    setFailedIcons(prev => ({ ...prev, [index]: true }));
                  }}
                  unoptimized
                />
              ) : (
                <span className="flex-shrink-0">
                  {channel.type === "hotline" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  )}
                </span>
              )}

              {showLabel && (
                <span className="absolute right-14 whitespace-nowrap bg-black/80 text-white px-3 py-1.5 rounded text-sm opacity-0 pointer-events-none transition-opacity duration-200 hover:opacity-100">
                  {channel.label || getDefaultLabel(channel.type)}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}



