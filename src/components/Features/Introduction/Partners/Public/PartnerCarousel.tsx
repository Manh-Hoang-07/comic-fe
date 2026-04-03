"use client";

import { useState } from "react";
import Image from "next/image";

import { Partner } from "@/types/api";

interface PartnerCarouselProps {
    partners: Partner[];
}

export function PartnerCarousel({ partners }: PartnerCarouselProps) {
    const [partnerIndex, setPartnerIndex] = useState(0);
    const itemsPerViewPartner = 5;
    const maxPartnerIndex = Math.max(0, Math.ceil(partners.length / itemsPerViewPartner) - 1);

    const nextPartner = () => {
        setPartnerIndex((prev) => (prev >= maxPartnerIndex ? 0 : prev + 1));
    };
    const prevPartner = () => {
        setPartnerIndex((prev) => (prev <= 0 ? maxPartnerIndex : prev - 1));
    };

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Đối Tác Chiến Lược</p>
                <div className="flex gap-2">
                    <button onClick={prevPartner} className="p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button onClick={nextPartner} className="p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${partnerIndex * 100}%)` }}
                >
                    {Array.from({ length: Math.ceil(partners.length / itemsPerViewPartner) }).map((_, pageIdx) => (
                        <div key={pageIdx} className="min-w-full flex justify-around items-center gap-8 md:gap-16 px-4">
                            {partners.slice(pageIdx * itemsPerViewPartner, (pageIdx + 1) * itemsPerViewPartner).map(partner => (
                                <div key={partner.id} className="w-32 h-16 relative flex items-center justify-center transition-all duration-300 hover:scale-105" title={partner.name}>
                                    {partner.logo ? (
                                        <Image
                                            src={partner.logo}
                                            alt={partner.name}
                                            width={128}
                                            height={64}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold text-gray-400 text-xl border-2 border-dashed border-gray-200 rounded">
                                            {partner.name.substring(0, 3)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


