export default function UserLoading() {
    return (
        <div className="min-h-screen bg-gray-50 animate-pulse">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Profile header skeleton */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <div className="h-6 w-48 bg-gray-200 rounded" />
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>

                {/* Tabs skeleton */}
                <div className="flex gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-10 w-28 bg-gray-200 rounded-lg" />
                    ))}
                </div>

                {/* Content skeleton */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                            <div className="h-4 w-48 bg-gray-200 rounded flex-1" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
