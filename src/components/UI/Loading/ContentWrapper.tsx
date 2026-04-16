'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface ContentWrapperProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Wrapper component hiển thị skeleton/dim effect khi pagination hoặc filter thay đổi
 * Detect click trên pagination buttons và filter links
 */
export function ContentWrapper({ children, className = '' }: ContentWrapperProps) {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const previousParamsRef = useRef(searchParams.toString());

    useEffect(() => {
        const currentParams = searchParams.toString();

        if (currentParams !== previousParamsRef.current) {
            setIsLoading(false);
            previousParamsRef.current = currentParams;
        }
    }, [searchParams]);

    // Listen for navigation start
    useEffect(() => {
        const handleNavigation = (e: Event) => {
            const target = e.target as HTMLElement;

            const isTrigger = target.closest('[data-pagination]') || target.closest('a[href*="page="]');

            if (isTrigger) {
                if (e.type === 'click' && (target.tagName === 'SELECT' || target.tagName === 'OPTION')) {
                    return;
                }
                setIsLoading(true);
            }
        };

        document.addEventListener('click', handleNavigation);
        document.addEventListener('change', handleNavigation);

        return () => {
            document.removeEventListener('click', handleNavigation);
            document.removeEventListener('change', handleNavigation);
        };
    }, []);

    return (
        <div className={`relative ${className}`}>
            <div className={`transition-opacity duration-200 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                {children}
            </div>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="flex items-center justify-center bg-white/90 rounded-xl px-6 py-4 shadow-md">
                        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
