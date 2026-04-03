interface LoadingSpinnerProps {
    /**
     * Variant of loading spinner
     * - fullscreen: Covers entire viewport (for page navigation)
     * - local: Covers only the parent container (for content updates)
     */
    variant?: 'fullscreen' | 'local';
}

/**
 * Shared loading spinner component
 * Used across the app for consistent loading UI
 */
export function LoadingSpinner({ variant = 'fullscreen' }: LoadingSpinnerProps) {
    const containerClass = variant === 'fullscreen'
        ? 'absolute inset-0 z-[100]'
        : 'absolute inset-0 z-50';

    return (
        <div className={`${containerClass} bg-white/80 backdrop-blur-sm flex items-center justify-center min-h-[100vh]`}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-700 font-semibold text-lg">Đang tải...</p>
            </div>
        </div>
    );
}
