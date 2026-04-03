"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/UI/Navigation/Button";
import Modal from "@/components/UI/Feedback/Modal";

import { TeamMember } from "@/types/api";

interface StaffListProps {
    initialStaff: TeamMember[];
}

export function StaffList({ initialStaff }: StaffListProps) {
    const [staffMembers] = useState<TeamMember[]>(initialStaff);
    const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>(initialStaff);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        department: "all",
        search: "",
    });

    useEffect(() => {
        let filtered = [...staffMembers];
        if (filters.department !== "all") {
            filtered = filtered.filter(member => member.department === filters.department);
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(member =>
                member.name.toLowerCase().includes(searchLower) ||
                member.position.toLowerCase().includes(searchLower) ||
                member.bio.toLowerCase().includes(searchLower) ||
                member.expertise?.toLowerCase().includes(searchLower)
            );
        }
        setFilteredMembers(filtered);
    }, [staffMembers, filters]);

    const openMemberModal = (member: TeamMember) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const departments = Array.from(new Set(staffMembers.map(member => member.department || "Khác")));

    return (
        <>
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <input
                            id="search"
                            name="search"
                            type="text"
                            placeholder="Tìm kiếm nhân viên..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            id="department"
                            name="department"
                            value={filters.department}
                            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                            className="appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm cursor-pointer text-sm font-medium text-gray-700"
                        >
                            <option value="all">Tất cả phòng ban</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Staff Grid */}
            {filteredMembers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
                    <p className="text-xl font-medium text-gray-900">Không tìm thấy nhân viên nào phù hợp với bộ lọc.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredMembers.map((member) => (
                        <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="h-64 bg-gray-100 overflow-hidden">
                                <Image
                                    src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                                    alt={member.name}
                                    width={400}
                                    height={500}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                                <p className="text-primary font-semibold text-sm mb-1">{member.position}</p>
                                <p className="text-xs text-gray-400 mb-3 font-medium">{member.department}</p>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {member.expertise && (
                                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">
                                            {member.expertise}
                                        </span>
                                    )}
                                    {member.experience && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                                            {member.experience} năm kinh nghiệm
                                        </span>
                                    )}
                                </div>
                                <Button
                                    onClick={() => openMemberModal(member)}
                                    className="w-full"
                                >
                                    Xem hồ sơ
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Member Detail Modal */}
            <Modal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedMember?.name}
                size="lg"
            >
                {selectedMember && (
                    <div>
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                            <div className="md:w-1/3">
                                <Image
                                    src={selectedMember.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}`}
                                    alt={selectedMember.name}
                                    width={400}
                                    height={500}
                                    className="w-full h-64 object-cover rounded-2xl"
                                />
                            </div>
                            <div className="md:w-2/3">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMember.name}</h3>
                                <p className="text-primary font-semibold mb-1">{selectedMember.position}</p>
                                <p className="text-sm text-gray-500 mb-4">{selectedMember.department}</p>
                                <p className="text-gray-600 mb-4">{selectedMember.bio}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Email</p>
                                        <p className="text-sm text-gray-800">{selectedMember.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Điện thoại</p>
                                        <p className="text-sm text-gray-800">{selectedMember.phone}</p>
                                    </div>
                                    {selectedMember.experience && (
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Kinh nghiệm</p>
                                            <p className="text-sm text-gray-800">{selectedMember.experience} năm</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-bold text-gray-900 mb-3">Chuyên môn</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedMember.expertise?.split(',').map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-lg">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="secondary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}

