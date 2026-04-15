"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/UI/Navigation/Button";
import Link from "next/link";

interface Service {
    id: string;
    title: string;
    description: string;
    image: string;
    icon: string;
    features: string[];
    price: string;
    duration: string;
    category: string;
    popular?: boolean;
}

interface ServiceFilterProps {
    initialServices: Service[];
}

export function ServiceFilter({ initialServices }: ServiceFilterProps) {
    const [filteredServices, setFilteredServices] = useState<Service[]>(initialServices);
    const [filters, setFilters] = useState({
        category: "all",
        search: "",
    });

    const categories = Array.from(new Set(initialServices.map(service => service.category)));

    useEffect(() => {
        let filtered = [...initialServices];

        if (filters.category !== "all") {
            filtered = filtered.filter(service => service.category === filters.category);
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(service =>
                service.title.toLowerCase().includes(searchLower) ||
                service.description.toLowerCase().includes(searchLower) ||
                service.features.some(feature => feature.toLowerCase().includes(searchLower))
            );
        }

        setFilteredServices(filtered);
    }, [initialServices, filters]);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "web":
                return (
                    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                    </svg>
                );
            case "mobile":
                return (
                    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
            case "design":
                return (
                    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                );
            case "consulting":
                return (
                    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                );
            case "marketing":
                return (
                    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                );
            case "cloud":
                return (
                    <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                );
            default:
                return null;
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
                            placeholder="Tìm kiếm dịch vụ..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-100 flex-wrap gap-1">
                        <button
                            onClick={() => setFilters({ ...filters, category: "all" })}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filters.category === "all"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Tất cả
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilters({ ...filters, category: cat })}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filters.category === cat
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredServices.map((service) => (
                    <div key={service.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden group hover:shadow-md transition-all duration-300 ${service.popular ? 'border-primary/40 ring-1 ring-primary/20' : 'border-gray-100'}`}>
                        {service.popular && (
                            <div className="bg-primary text-white text-center py-1.5 text-xs font-bold tracking-wide">
                                Phổ biến nhất
                            </div>
                        )}
                        <div className="h-44 bg-gray-100 overflow-hidden">
                            <Image
                                src={service.image}
                                alt={service.title}
                                width={400}
                                height={200}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center mb-4 gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    {getIcon(service.icon)}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                            </div>
                            <p className="text-gray-600 mb-4 text-sm line-clamp-2">{service.description}</p>
                            <div className="mb-5 space-y-1">
                                <p className="text-xs text-gray-500">⏱ Thời gian: <span className="font-medium text-gray-700">{service.duration}</span></p>
                                <p className="text-sm font-bold text-primary">{service.price}</p>
                            </div>
                            <Link href={`/services/${service.id}`}>
                                <Button className="w-full">
                                    Xem chi tiết
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {filteredServices.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
                    <p className="text-xl font-medium text-gray-900">Không tìm thấy dịch vụ nào phù hợp với bộ lọc.</p>
                </div>
            )}
        </>
    );
}

