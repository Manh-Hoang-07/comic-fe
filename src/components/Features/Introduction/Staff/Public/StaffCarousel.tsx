"use client";

import { useState } from "react";
import Image from "next/image";
import { TeamMember } from "@/types/api";

interface StaffCarouselProps {
    staff: TeamMember[];
}

export function StaffCarousel({ staff }: StaffCarouselProps) {
    const [staffIndex, setStaffIndex] = useState(0);
    const itemsPerViewStaff = 4;
    const maxStaffIndex = Math.max(0, Math.ceil(staff.length / itemsPerViewStaff) - 1);

    const nextStaff = () => {
        setStaffIndex((prev) => (prev >= maxStaffIndex ? 0 : prev + 1));
    };
    const prevStaff = () => {
        setStaffIndex((prev) => (prev <= 0 ? maxStaffIndex : prev - 1));
    };

    return (
        <>
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Đội Ngũ Lãnh Đạo</h2>
                    <p className="mt-4 text-xl text-gray-500">Những chuyên gia hàng đầu dẫn dắt công ty.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={prevStaff} className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors z-10">
                        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button onClick={nextStaff} className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors z-10">
                        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${staffIndex * 100}%)` }}
                >
                    {Array.from({ length: Math.ceil(staff.length / itemsPerViewStaff) }).map((_, pageIdx) => (
                        <div key={pageIdx} className="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-1">
                            {staff.slice(pageIdx * itemsPerViewStaff, (pageIdx + 1) * itemsPerViewStaff).map(person => (
                                <div key={person.id} className="text-center group">
                                    <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg group-hover:border-primary/20 transition-colors">
                                        <Image
                                            src={person.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`}
                                            alt={person.name}
                                            width={192}
                                            height={192}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{person.name}</h3>
                                    <p className="text-primary font-medium text-sm mb-2">{person.position}</p>
                                    <p className="text-gray-500 text-sm line-clamp-2 px-4">{person.bio}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}


