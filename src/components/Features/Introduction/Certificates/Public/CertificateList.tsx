"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/UI/Navigation/Button";

interface Certificate {
    id: number;
    name: string;
    description: string;
    image: string;
    issued_by: string;
    issued_date: string | object | null;
    expiry_date: string | object | null;
    certificate_number: string;
    type: string;
    status: string;
    skills?: string[];
}

interface CertificateListProps {
    initialCertificates: Certificate[];
}

// Helper to safely get date time
const getDateTime = (dateString: string | object | null | undefined): number => {
    if (!dateString || typeof dateString === 'object') return 0;
    return new Date(dateString).getTime();
};

const formatDate = (date: string | object | null | undefined) => {
    if (!date || typeof date === 'object') return "";
    try {
        return new Date(date).toLocaleDateString('vi-VN');
    } catch (e) {
        return "";
    }
};

export function CertificateList({ initialCertificates }: CertificateListProps) {
    const [certificates] = useState<Certificate[]>(initialCertificates);
    const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>(initialCertificates);
    const [filters, setFilters] = useState({
        type: "all",
        search: "",
        sortBy: "newest",
    });

    useEffect(() => {
        let filtered = [...certificates];
        if (filters.type !== "all") {
            filtered = filtered.filter(cert => cert.type === filters.type);
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(cert =>
                cert.name.toLowerCase().includes(searchLower) ||
                cert.description.toLowerCase().includes(searchLower) ||
                cert.issued_by.toLowerCase().includes(searchLower) ||
                (cert.skills || []).some(skill => skill.toLowerCase().includes(searchLower))
            );
        }
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case "newest":
                    return getDateTime(b.issued_date) - getDateTime(a.issued_date);
                case "oldest":
                    return getDateTime(a.issued_date) - getDateTime(b.issued_date);
                case "title":
                    return a.name.localeCompare(b.name);
                case "expiry":
                    const aExpiry = getDateTime(a.expiry_date);
                    const bExpiry = getDateTime(b.expiry_date);
                    if (aExpiry === 0 && bExpiry === 0) return 0;
                    if (aExpiry === 0) return 1;
                    if (bExpiry === 0) return -1;
                    return aExpiry - bExpiry;
                default:
                    return 0;
            }
        });
        setFilteredCertificates(filtered);
    }, [certificates, filters]);

    const types = Array.from(new Set(certificates.map(cert => cert.type).filter(Boolean)));

    const isExpiringSoon = (expiryDate?: string | object | null) => {
        const time = getDateTime(expiryDate);
        if (time === 0) return false;

        const today = new Date().getTime();
        const daysUntilExpiry = Math.floor((time - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
    };

    const isExpired = (expiryDate?: string | object | null) => {
        const time = getDateTime(expiryDate);
        if (time === 0) return false;
        return time < new Date().getTime();
    };

    return (
        <>
            {/* Filters and Sorting */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Tìm kiếm
                        </label>
                        <input
                            id="search"
                            name="search"
                            type="text"
                            placeholder="Tìm kiếm chứng chỉ..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                            Loại
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả</option>
                            {types.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                            Sắp xếp
                        </label>
                        <select
                            id="sortBy"
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="title">Theo tên</option>
                            <option value="expiry">Theo ngày hết hạn</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Certificates Grid */}
            {filteredCertificates.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">Không tìm thấy chứng chỉ nào phù hợp với bộ lọc.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCertificates.map((certificate) => (
                        <div key={certificate.id || Math.random()} className="bg-white rounded-lg shadow-md overflow-hidden group">
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                {certificate.image ? (
                                    <Image
                                        src={certificate.image}
                                        alt={certificate.name || "Certificate Image"}
                                        width={500}
                                        height={300}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-500">
                                        <span className="text-4xl">📜</span>
                                    </div>
                                )}
                                {isExpired(certificate.expiry_date) && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded shadow-sm">
                                        Đã hết hạn
                                    </div>
                                )}
                                {isExpiringSoon(certificate.expiry_date) && !isExpired(certificate.expiry_date) && (
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded shadow-sm">
                                        Sắp hết hạn
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{certificate.name}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{certificate.description}</p>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">Cấp bởi: {certificate.issued_by}</p>
                                    <p className="text-sm text-gray-500">Ngày cấp: {formatDate(certificate.issued_date) || "N/A"}</p>
                                    {formatDate(certificate.expiry_date) && (
                                        <p className="text-sm text-gray-500">Ngày hết hạn: {formatDate(certificate.expiry_date)}</p>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {(certificate.skills || []).slice(0, 2).map((skill, index) => (
                                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                            {skill}
                                        </span>
                                    ))}
                                    {(certificate.skills || []).length > 2 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                            +{(certificate.skills || []).length - 2} nữa
                                        </span>
                                    )}
                                </div>
                                <Link href={`/certificates/${certificate.id}`}>
                                    <Button className="w-full">
                                        Xem chi tiết
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}


