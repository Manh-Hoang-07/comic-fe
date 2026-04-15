'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Global loading overlay - hiệu ứng khi chuyển trang
 * Hiển thị overlay + spinner để người dùng biết trang đang chuyển
 */
export function GlobalLoadingOverlay() {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Khi pathname/searchParams thay đổi => navigation hoàn tất
    useEffect(() => {
        setIsLoading(false);
    }, [pathname, searchParams]);

    // Lắng nghe click vào link nội bộ - tối ưu: early return nhanh, cache origin
    useEffect(() => {
        const currentOrigin = window.location.origin;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Early return: chỉ xử lý khi click vào <a>
            const link = target.closest('a') as HTMLAnchorElement | null;
            if (!link?.href || link.target === '_blank' || link.download) return;

            // Dùng link.pathname trực tiếp (không cần new URL) cho link cùng origin
            if (link.origin === currentOrigin && link.pathname !== pathname) {
                setIsLoading(true);
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [pathname]);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[99] bg-white/60 backdrop-blur-[2px] transition-opacity duration-200 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500">Đang chuyển trang...</p>
            </div>
        </div>
    );
}
