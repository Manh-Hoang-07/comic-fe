"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/UI/Navigation/Button";
import { Breadcrumbs } from "@/components/UI/Navigation/Breadcrumbs";
import api from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    sort_order?: number;
}

export default function FAQsClient() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [filteredFAQs, setFilteredFAQs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [filters, setFilters] = useState({
        category: "all",
        search: "",
    });

    // Fetch FAQs from API
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await api.get(publicEndpoints.faqs.list);
                if (response.data?.success) {
                    const faqData = response.data.data || [];
                    setFaqs(faqData);
                    setFilteredFAQs(faqData);
                }
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...faqs];

        // Filter by category
        if (filters.category !== "all") {
            filtered = filtered.filter(faq => faq.category === filters.category);
        }

        // Filter by search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(faq =>
                faq.question.toLowerCase().includes(searchLower) ||
                faq.answer.toLowerCase().includes(searchLower)
            );
        }

        // Sort by order if available
        filtered.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

        setFilteredFAQs(filtered);
    }, [faqs, filters]);

    const toggleExpanded = (id: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedItems(newExpanded);
    };

    const categories = Array.from(new Set(faqs.map(faq => String(faq.category)))).filter(cat => cat && cat !== "all");

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] pb-20 transition-colors duration-300">
                <div className="container mx-auto px-4 mt-8">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="ml-3 text-gray-600 font-medium">Đang tải câu hỏi...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-20 transition-colors duration-300">
            <div className="container mx-auto px-4 mt-8">
                <Breadcrumbs items={[{ label: "Câu hỏi thường gặp" }]} />
                <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-l-8 border-primary pl-6">Câu hỏi thường gặp</h1>
                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                                Tìm kiếm
                            </label>
                            <input
                                id="search"
                                name="search"
                                type="text"
                                placeholder="Tìm kiếm câu hỏi..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                Danh mục
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm cursor-pointer"
                            >
                                <option key="all" value="all">Tất cả</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* FAQs List */}
                {filteredFAQs.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
                        <p className="text-xl font-medium text-gray-900">Không tìm thấy câu hỏi nào.</p>
                        <p className="text-gray-500 mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                    </div>
                ) : (
                    <div className="space-y-3 mb-12">
                        {filteredFAQs.map((faq) => (
                            <div key={faq.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <button
                                    onClick={() => toggleExpanded(faq.id)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none transition-colors"
                                >
                                    <h3 className="text-base font-semibold text-gray-900 pr-4">{faq.question}</h3>
                                    <svg
                                        className={`h-5 w-5 text-gray-400 flex-shrink-0 transform transition-transform duration-200 ${expandedItems.has(faq.id) ? "rotate-180" : ""}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {expandedItems.has(faq.id) && (
                                    <div className="px-6 pb-5">
                                        <div className="border-t border-gray-100 pt-4">
                                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA Section */}
                <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy câu trả lời bạn cần?</h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Nếu bạn có câu hỏi khác chưa được trả lời, đừng ngần ngại liên hệ với chúng tôi.
                        Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp bạn.
                    </p>
                    <div className="flex justify-center gap-2">
                        <Button size="lg">
                            Liên hệ hỗ trợ
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
