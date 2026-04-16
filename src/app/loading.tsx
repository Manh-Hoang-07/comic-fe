/**
 * Root loading fallback - skeleton nhẹ, không dùng spinner fullscreen
 * Các route group đã có loading.tsx riêng với skeleton phù hợp hơn
 */
export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 animate-pulse">
            <div className="h-16 bg-white border-b border-gray-100" />
            <div className="container mx-auto px-4 py-8">
                <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
                <div className="h-4 w-96 bg-gray-200 rounded mb-8" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-[2/3] bg-gray-200 rounded-lg" />
                            <div className="h-4 w-3/4 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
