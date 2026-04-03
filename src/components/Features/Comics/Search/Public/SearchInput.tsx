'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchInput({ className = "" }: { className?: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [term, setTerm] = useState(searchParams.get('search')?.toString() || '');

    // 1. Sync URL -> Local State (only when URL changes externally)
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        if (urlSearch !== term) {
            setTerm(urlSearch);
        }
        // We intentionally only sync when searchParams changes. 
        // Including 'term' here would cause user input to be wiped before the debounce finishes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // 2. Sync Local State -> URL (with debounce)
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        // Skip if search term in URL already matches local state
        if (term === urlSearch) return;

        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (!term) {
                params.delete('search');
                if (pathname.startsWith('/comics')) {
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                }
                return;
            }

            params.set('search', term);
            params.set('page', '1');

            const targetPath = '/comics';
            router.replace(`${targetPath}?${params.toString()}`, { scroll: false });
        }, 500);

        return () => clearTimeout(handler);
    }, [term, router, pathname, searchParams]);


    return (
        <div className={`relative w-full group transition-all duration-300 ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary group-focus-within:scale-110 transition-all duration-500" />
            </div>
            <input
                type="text"
                className="block w-full pl-11 pr-16 py-3.5 bg-white border border-gray-100/50 rounded-2xl 
                text-gray-900 placeholder:text-gray-400 sm:text-sm leading-5
                shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]
                group-focus-within:shadow-[0_8px_30px_rgba(59,130,246,0.1)]
                group-focus-within:border-primary/20
                transition-all duration-500 outline-none"
                placeholder="Tìm kiếm truyện yêu thích của bạn..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />

            <div className="absolute inset-y-0 right-0 py-2.5 pr-4 flex items-center gap-2">
                {term && (
                    <button
                        onClick={() => setTerm('')}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-primary rounded-full transition-all duration-300 shadow-sm"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
                {!term && (
                    <div className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded-lg border border-gray-100 bg-gray-50/50 text-[10px] font-bold text-gray-400 select-none group-focus-within:opacity-0 transition-opacity duration-300">
                        <span className="text-[12px]">⌘</span>
                        <span>K</span>
                    </div>
                )}
            </div>

            {/* Subtle animated border gradient */}
            <div className="absolute -inset-[1px] rounded-[17px] bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-focus-within:via-primary/30 group-focus-within:from-primary/10 group-focus-within:to-primary/10 -z-10 transition-all duration-1000" />
        </div>
    );
}
