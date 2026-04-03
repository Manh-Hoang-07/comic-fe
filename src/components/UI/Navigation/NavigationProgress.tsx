'use client';

import NextTopLoader from 'nextjs-toploader';

/**
 * Global navigation progress bar and loading indicator
 * Uses nextjs-toploader to show immediate feedback on route changes and search param updates
 */
export function NavigationProgress() {
    return (
        <NextTopLoader
            color="#DC2626" // red-600 matched from theme
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false} // Hide spinner, just show the bar
            easing="ease"
            speed={200}
            shadow="0 0 10px #DC2626,0 0 5px #DC2626"
            zIndex={9999}
            showAtBottom={false}
        />
    );
}
