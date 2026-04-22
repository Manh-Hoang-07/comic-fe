"use client";
import { useState, useMemo } from "react";

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    sort_order?: number;
}

interface FaqFilters {
    category: string;
    search: string;
}

export function useFaqFilter(initialFaqs: FAQ[]) {
    const [filters, setFilters] = useState<FaqFilters>({
        category: "all",
        search: "",
    });
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const categories = useMemo(
        () => Array.from(new Set(initialFaqs.map(faq => String(faq.category)))).filter(cat => cat && cat !== "all"),
        [initialFaqs]
    );

    const filteredFAQs = useMemo(() => {
        let filtered = [...initialFaqs];

        if (filters.category !== "all") {
            filtered = filtered.filter(faq => faq.category === filters.category);
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(faq =>
                faq.question.toLowerCase().includes(searchLower) ||
                faq.answer.toLowerCase().includes(searchLower)
            );
        }

        filtered.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

        return filtered;
    }, [initialFaqs, filters]);

    const toggleExpanded = (id: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedItems(newExpanded);
    };

    return { filteredFAQs, categories, filters, setFilters, expandedItems, toggleExpanded };
}
