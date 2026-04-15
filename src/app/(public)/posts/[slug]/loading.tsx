export default function PostDetailLoading() {
    return (
        <div className="min-h-screen bg-gray-50 animate-pulse">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Breadcrumb */}
                <div className="h-4 w-64 bg-gray-200 rounded mb-6" />

                {/* Title */}
                <div className="h-10 w-3/4 bg-gray-200 rounded mb-4" />

                {/* Meta */}
                <div className="flex gap-4 mb-8">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                </div>

                {/* Featured image */}
                <div className="aspect-video bg-gray-200 rounded-xl mb-8" />

                {/* Content lines */}
                <div className="space-y-4">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${75 + Math.random() * 25}%` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
