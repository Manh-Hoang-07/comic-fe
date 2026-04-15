export default function PostsLoading() {
    return (
        <div className="min-h-screen bg-gray-50 animate-pulse">
            <div className="container mx-auto px-4 py-8">
                {/* Title */}
                <div className="h-8 w-48 bg-gray-200 rounded mb-6" />

                {/* Category tabs */}
                <div className="flex gap-3 mb-8">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-9 w-24 bg-gray-200 rounded-full" />
                    ))}
                </div>

                {/* Post grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100">
                            <div className="aspect-video bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                                <div className="h-4 w-full bg-gray-200 rounded" />
                                <div className="h-4 w-2/3 bg-gray-200 rounded" />
                                <div className="flex gap-3 pt-2">
                                    <div className="h-3 w-20 bg-gray-200 rounded" />
                                    <div className="h-3 w-16 bg-gray-200 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
