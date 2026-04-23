export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 animate-pulse">
            <div className="h-16 bg-white border-b border-gray-100" />
            <div className="container mx-auto px-4 py-8">
                <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
                <div className="h-8 w-64 bg-gray-200 rounded mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                            <div className="aspect-video bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                                <div className="h-4 w-full bg-gray-200 rounded" />
                                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
