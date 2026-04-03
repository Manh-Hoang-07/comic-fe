"use client";

import { useState } from "react";
import { FAQ } from "@/types/api";

interface FaqAccordionProps {
    faqs: FAQ[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
    const [openFaqId, setOpenFaqId] = useState<string | null>(null);

    const toggleFaq = (id: string) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    return (
        <div className="space-y-4">
            {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                    <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-300">
                        <button
                            onClick={() => toggleFaq(faq.id)}
                            className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none"
                        >
                            <span className="font-bold text-lg text-gray-900 pr-8">{faq.question}</span>
                            <span className={`transform transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-6 pt-0 text-gray-600 border-t border-gray-100">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


