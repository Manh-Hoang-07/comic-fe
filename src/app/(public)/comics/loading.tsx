export default function ComicsLoading() {
    return (
        <div className="min-h-screen bg-gray-50 animate-pulse">
            <div className="container mx-auto px-4 py-8">
                {/* Title */}
                <div className="h-8 w-56 bg-gray-200 rounded mb-6" />

                {/* Filter bar */}
                <div className="flex gap-3 mb-8">
                    <div className="h-10 w-48 bg-gray-200 rounded-lg" />
                    <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                    <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                </div>

                {/* Comic grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="space-y-2">
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
