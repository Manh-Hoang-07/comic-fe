'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Global loading overlay that shows during all navigation
 */
export function GlobalLoadingOverlay() {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Track navigation completion
    useEffect(() => {
        setIsLoading(false);
    }, [pathname, searchParams]);

    // Listen for link clicks
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && link.href) {
                const url = new URL(link.href);
                const currentUrl = new URL(window.location.href);

                // Check if it's an internal navigation (same origin, different path or search params)
                if (url.origin === currentUrl.origin &&
                    (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)) {
                    setIsLoading(true);
                }
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    if (!isLoading) return null;

    return <LoadingSpinner />;
}
