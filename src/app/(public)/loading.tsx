export default function PublicLoading() {
    return (
        <div className="min-h-screen bg-gray-50 animate-pulse">
            <div className="container mx-auto px-4 py-8">
                <div className="h-4 w-48 bg-gray-200 rounded mb-6" />
                <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
                <div className="flex gap-3 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-9 w-24 bg-gray-200 rounded-full" />
                    ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                            <div className="aspect-[3/4] bg-gray-200" />
                            <div className="p-3 space-y-2">
                                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
