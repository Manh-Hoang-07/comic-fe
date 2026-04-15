"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/UI/Navigation/Button";
import Link from "next/link";

interface Project {
    id: string;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    cover_image: string | null;
    location: string;
    status: "completed" | "in_progres" | "planned";
    client_name: string;
    images: string;
}

interface ProjectFilterProps {
    initialProjects: Project[];
}

export function ProjectFilter({ initialProjects }: ProjectFilterProps) {
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects);
    const [filters, setFilters] = useState({
        status: "all",
        search: "",
    });

    useEffect(() => {
        let filtered = [...initialProjects];

        if (filters.status !== "all") {
            filtered = filtered.filter(project => project.status === filters.status);
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(project =>
                project.name.toLowerCase().includes(searchLower) ||
                project.description.toLowerCase().includes(searchLower) ||
                project.client_name.toLowerCase().includes(searchLower) ||
                project.location.toLowerCase().includes(searchLower)
            );
        }

        setFilteredProjects(filtered);
    }, [initialProjects, filters]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-green-50 text-green-700 border border-green-100">Hoàn thành</span>;
            case "in-progres":
            case "in_progres":
                return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 border border-amber-100">Đang thực hiện</span>;
            case "planned":
                return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-100">Kế hoạch</span>;
            default:
                return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-50 text-gray-700 border border-gray-100">{status}</span>;
        }
    };

    return (
        <>
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Tìm kiếm dự án..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-100 gap-1">
                        {[
                            { value: "all", label: "Tất cả" },
                            { value: "completed", label: "Hoàn thành" },
                            { value: "in_progres", label: "Đang thực hiện" },
                            { value: "planned", label: "Kế hoạch" },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setFilters({ ...filters, status: opt.value })}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filters.status === opt.value
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300">
                        <div className="h-48 bg-gray-100 overflow-hidden relative">
                            <Image
                                src={project.cover_image || "/images/placeholder.jpg"}
                                alt={project.name}
                                width={400}
                                height={200}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-2 gap-2">
                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{project.name}</h3>
                                {getStatusBadge(project.status)}
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{project.short_description}</p>
                            <div className="mb-4 space-y-1">
                                <p className="text-xs text-gray-500">👤 Khách hàng: <span className="font-medium text-gray-700">{project.client_name}</span></p>
                                <p className="text-xs text-gray-500">📍 Địa điểm: <span className="font-medium text-gray-700">{project.location}</span></p>
                            </div>
                            <Link href={`/projects/${project.slug}`} className="block w-full">
                                <Button className="w-full">
                                    Xem chi tiết
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
                    <p className="text-xl font-medium text-gray-900">Không tìm thấy dự án nào phù hợp với bộ lọc.</p>
                </div>
            )}
        </>
    );
}

