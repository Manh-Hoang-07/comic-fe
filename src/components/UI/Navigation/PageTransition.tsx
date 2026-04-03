'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Page transition wrapper with loading overlay
 * Provides smooth transitions between pages
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const [displayChildren, setDisplayChildren] = useState(children);

    useEffect(() => {
        // Show loading overlay
        setIsLoading(true);

        // Update children after a brief delay
        const timer = setTimeout(() => {
            setDisplayChildren(children);
            setIsLoading(false);
        }, 150);

        return () => clearTimeout(timer);
    }, [pathname, children]);

    return (
        <>
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-[9998] flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            Đang tải...
                        </p>
                    </div>
                </div>
            )}
            <div className={isLoading ? 'opacity-50' : 'opacity-100 transition-opacity duration-300'}>
                {displayChildren}
            </div>
        </>
    );
}


