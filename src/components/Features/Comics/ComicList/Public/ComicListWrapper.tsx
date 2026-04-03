'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/UI/Loading/LoadingSpinner';

interface ComicListWrapperProps {
    children: React.ReactNode;
}

export function ComicListWrapper({ children }: ComicListWrapperProps) {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [previousParams, setPreviousParams] = useState(searchParams.toString());

    useEffect(() => {
        const currentParams = searchParams.toString();

        // Check if params changed (navigation happened)
        if (currentParams !== previousParams) {
            setIsLoading(false);
            setPreviousParams(currentParams);
        }
    }, [searchParams, previousParams]);

    // Listen for navigation start
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if clicked element is a pagination button or link
            if (target.closest('[data-pagination]') || target.closest('a[href*="page="]')) {
                setIsLoading(true);
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="relative">
            {isLoading && <LoadingSpinner variant="local" />}
            {children}
        </div>
    );
}
