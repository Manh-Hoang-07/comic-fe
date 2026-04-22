"use client";

import { useFaqFilter, FAQ } from "@/hooks/ui-ux/public/useFaqFilter";

interface FaqsPageProps {
  initialFaqs: FAQ[];
}

export default function FaqsPage({ initialFaqs }: FaqsPageProps) {
  const { filteredFAQs, categories, filters, setFilters, expandedItems, toggleExpanded } =
    useFaqFilter(initialFaqs);

  return (
    <>
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
              {categories.map((cat) => (
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
                  className={`h-5 w-5 text-gray-400 flex-shrink-0 transform transition-transform duration-200 ${
                    expandedItems.has(faq.id) ? "rotate-180" : ""
                  }`}
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
    </>
  );
}
