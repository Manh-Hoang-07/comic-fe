'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Global loading overlay - hiệu ứng nhẹ khi chuyển trang
 * Chỉ làm mờ nhẹ content hiện tại, không che toàn bộ màn hình
 */
export function GlobalLoadingOverlay() {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Khi pathname/searchParams thay đổi => navigation hoàn tất
    useEffect(() => {
        setIsLoading(false);
    }, [pathname, searchParams]);

    // Lắng nghe click vào link nội bộ
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && link.href) {
                try {
                    const url = new URL(link.href);
                    const currentUrl = new URL(window.location.href);

                    // Chỉ hiện loading cho navigation nội bộ (khác path hoặc search)
                    if (url.origin === currentUrl.origin &&
                        (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)) {
                        setIsLoading(true);
                    }
                } catch {
                    // URL không hợp lệ, bỏ qua
                }
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    if (!isLoading) return null;

    // Overlay nhẹ - chỉ làm mờ content, không che toàn bộ
    return (
        <div className="fixed inset-0 z-[99] bg-white/40 backdrop-blur-[1px] pointer-events-none transition-opacity duration-200" />
    );
}
