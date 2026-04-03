"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ComicCategory } from '@/types/comic';

interface Props {
    categories: ComicCategory[];
}

export const CategorySelect: React.FC<Props> = ({ categories }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategoryId = searchParams.get('comic_category_id') || "";

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set('comic_category_id', value);
        } else {
            params.delete('comic_category_id');
        }

        // Reset page to 1 when category changes
        params.delete('page');

        router.push(`/comics?${params.toString()}`);
    };

    return (
        <div className="relative min-w-[200px]">
            <select
                value={currentCategoryId}
                onChange={handleCategoryChange}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500 transition-all cursor-pointer shadow-sm hover:border-red-500"
            >
                <option value="">Tất cả thể loại</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
};


