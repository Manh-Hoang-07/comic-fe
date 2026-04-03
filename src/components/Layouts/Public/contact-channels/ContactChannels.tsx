"use client";

import Image from "next/image";
import { useState } from "react";

interface ContactChannel {
  type: string;
  value: string;
  label?: string;
  icon?: string;
  enabled?: boolean;
  sort_order?: number;
  url_template?: string;
}

interface ContactChannelsProps {
  channels?: ContactChannel[] | null;
  showLabel?: boolean;
  variant?: "default" | "compact" | "minimal" | "dark";
}

export default function ContactChannels({
  channels = [],
  showLabel = true,
  variant = "default",
}: ContactChannelsProps) {
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
      zalo: "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200",
      messenger: "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200",
      hotline: "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200",
      telegram: "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200",
      whatsapp: "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200",
    };

    return classMap[type] || "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200";
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

  if (enabledChannels.length === 0) {
    return null;
  }

  return (
    <div className="contact-channels">
      <div className="flex flex-wrap items-center gap-3">
        {enabledChannels.map((channel, index) => (
          <a
            key={index}
            href={getChannelUrl(channel)}
            target={isExternalUrl(getChannelUrl(channel)) ? "_blank" : undefined}
            rel={isExternalUrl(getChannelUrl(channel)) ? "noopener noreferrer" : undefined}
            aria-label={channel.label || channel.type}
            title={channel.label || channel.type}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${getChannelClass(
              channel.type
            )} ${variant === "dark" ? "text-white border-white/20 hover:bg-white/10" : ""}`}
          >
            {channel.icon && !failedIcons[index] ? (
              <Image
                src={channel.icon}
                alt={channel.label || channel.type}
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
                onError={() => {
                  setFailedIcons(prev => ({ ...prev, [index]: true }));
                }}
                unoptimized
              />
            ) : (
              <span className="flex-shrink-0">
                {channel.type === "hotline" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
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
              <span className="text-sm font-medium">
                {channel.label || getDefaultLabel(channel.type)}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}



