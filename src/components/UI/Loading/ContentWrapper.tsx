'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/UI/Loading/LoadingSpinner';

interface ContentWrapperProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Wrapper component that shows loading overlay when pagination or filtering happens
 * Detects clicks on pagination buttons or filter links
 */
export function ContentWrapper({ children, className = '' }: ContentWrapperProps) {
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
        const handleNavigation = (e: Event) => {
            const target = e.target as HTMLElement;

            // Check if clicked/changed element is a pagination trigger
            const isTrigger = target.closest('[data-pagination]') || target.closest('a[href*="page="]');

            if (isTrigger) {
                // If it's a click on select or option, don't show loading yet 
                // (wait for the 'change' event or actual navigation)
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
            {isLoading && <LoadingSpinner variant="local" />}
            {children}
        </div>
    );
}
