export default function PublicLoading() {
    return (
        <div className="min-h-screen bg-gray-50 animate-pulse">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb skeleton */}
                <div className="h-4 w-48 bg-gray-200 rounded mb-6" />

                {/* Title skeleton */}
                <div className="h-8 w-72 bg-gray-200 rounded mb-8" />

                {/* Content grid skeleton */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-[2/3] bg-gray-200 rounded-lg" />
                            <div className="h-4 w-3/4 bg-gray-200 rounded" />
                            <div className="h-3 w-1/2 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
