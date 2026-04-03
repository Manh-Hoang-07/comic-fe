"use client";

import { useState, useEffect } from "react";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";

interface ContactChannel {
    type: string;
    value: string;
    label: string;
    icon: string | null;
    url_template: string;
    enabled: boolean;
    sort_order: number;
}

interface ContactChannelsManagerProps {
    value: ContactChannel[];
    onChange: (value: ContactChannel[]) => void;
}

const DEFAULT_VALUE: ContactChannel[] = [];

export default function ContactChannelsManager({ value = DEFAULT_VALUE, onChange }: ContactChannelsManagerProps) {
    const [channels, setChannels] = useState<ContactChannel[]>(value || DEFAULT_VALUE);

    // Sync internal state when value prop changes (e.g. after API fetch)
    useEffect(() => {
        if (Array.isArray(value)) {
            // Only update if it's actually different to prevent infinite loops
            if (JSON.stringify(value) !== JSON.stringify(channels)) {
                setChannels(value);
            }
        }
    }, [value, channels]);

    const handleUpdate = (index: number, updates: Partial<ContactChannel>) => {
        const newChannels = [...channels];
        newChannels[index] = { ...newChannels[index], ...updates };
        setChannels(newChannels);
        onChange(newChannels);
    };

    const handleAdd = () => {
        const newChannel: ContactChannel = {
            type: "custom",
            value: "",
            label: "Kênh mới",
            icon: null,
            url_template: "{value}",
            enabled: true,
            sort_order: channels.length + 1,
        };
        const newChannels = [...channels, newChannel];
        setChannels(newChannels);
        onChange(newChannels);
    };

    const handleRemove = (index: number) => {
        const newChannels = channels.filter((_, i) => i !== index);
        setChannels(newChannels);
        onChange(newChannels);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Các kênh liên hệ (Contact Channels)</label>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm kênh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {channels.map((channel, index) => (
                    <div key={index} className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm space-y-4 relative group hover:border-primary/30 transition-all">
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex gap-4">
                            {/* Icon Uploader Section */}
                            <div className="flex-shrink-0">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                                <div className="w-20">
                                    <ImageUploader
                                        value={channel.icon}
                                        onChange={(val) => handleUpdate(index, { icon: val as string })}
                                        onRemove={() => handleUpdate(index, { icon: null })}
                                    />
                                </div>
                            </div>

                            {/* Type and Label Section */}
                            <div className="flex-1 grid grid-cols-1 gap-3">
                                <FormField
                                    label="Loại (Type)"
                                    value={channel.type}
                                    onChange={(e) => handleUpdate(index, { type: e.target.value })}
                                    placeholder="hotline, zalo..."
                                />
                                <FormField
                                    label="Nhãn (Label)"
                                    value={channel.label}
                                    onChange={(e) => handleUpdate(index, { label: e.target.value })}
                                    placeholder="Zalo tư vấn..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 pt-2">
                            <FormField
                                label="Giá trị (Value)"
                                value={channel.value}
                                onChange={(e) => handleUpdate(index, { value: e.target.value })}
                                placeholder="SĐT, Link, ID..."
                            />

                            <FormField
                                label="URL Template"
                                value={channel.url_template}
                                onChange={(e) => handleUpdate(index, { url_template: e.target.value })}
                                placeholder="https://zalo.me/{value}"
                                helpText="Dùng {value} để thay thế giá trị trên"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-6">
                                <FormField
                                    type="checkbox"
                                    label="Kích hoạt"
                                    value={channel.enabled}
                                    onChange={(e) => handleUpdate(index, { enabled: e.target.checked })}
                                />

                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">Thứ tự:</label>
                                    <input
                                        type="number"
                                        value={channel.sort_order}
                                        onChange={(e) => handleUpdate(index, { sort_order: Number(e.target.value) })}
                                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {channels.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                    Chưa có kênh liên hệ nào. Nhấn &quot;Thêm kênh&quot; để bắt đầu.
                </div>
            )}
        </div>
    );
}


