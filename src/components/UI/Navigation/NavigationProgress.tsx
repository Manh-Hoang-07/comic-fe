'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Lightweight navigation progress bar - thay thế nextjs-toploader
 * Không dùng nprogress, không gây forced reflow
 */
export function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const cleanup = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        timerRef.current = null;
        intervalRef.current = null;
    }, []);

    // Navigation hoàn tất khi pathname/searchParams thay đổi
    useEffect(() => {
        if (visible) {
            cleanup();
            setProgress(100);
            timerRef.current = setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 200);
        }
    }, [pathname, searchParams, cleanup, visible]);

    // Lắng nghe click link nội bộ để bắt đầu progress
    useEffect(() => {
        const currentOrigin = window.location.origin;

        const handleClick = (e: MouseEvent) => {
            const link = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null;
            if (!link?.href || link.target === '_blank' || link.download) return;

            if (link.origin === currentOrigin && link.pathname !== pathname) {
                cleanup();
                setProgress(8);
                setVisible(true);

                // Tăng dần progress
                let current = 8;
                intervalRef.current = setInterval(() => {
                    current += (90 - current) * 0.1;
                    if (current >= 90) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                    }
                    setProgress(current);
                }, 200);
            }
        };

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
            cleanup();
        };
    }, [pathname, cleanup]);

    if (!visible) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent pointer-events-none"
        >
            <div
                className="h-full bg-[#DC2626] transition-all duration-200 ease-out"
                style={{
                    width: `${progress}%`,
                    boxShadow: '0 0 10px #DC2626, 0 0 5px #DC2626',
                }}
            />
        </div>
    );
}
