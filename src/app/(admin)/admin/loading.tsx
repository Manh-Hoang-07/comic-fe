export default function AdminLoading() {
    return (
        <div className="flex-1 p-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-48 bg-gray-200 rounded" />
                <div className="h-10 w-32 bg-gray-200 rounded-lg" />
            </div>

            {/* Filter bar skeleton */}
            <div className="flex gap-3 mb-6">
                <div className="h-10 w-64 bg-gray-200 rounded-lg" />
                <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                <div className="h-10 w-32 bg-gray-200 rounded-lg" />
            </div>

            {/* Table skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Table header */}
                <div className="flex gap-4 p-4 border-b border-gray-100 bg-gray-50">
                    <div className="h-4 w-8 bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-4 w-48 bg-gray-200 rounded flex-1" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
                {/* Table rows */}
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex gap-4 p-4 border-b border-gray-50">
                        <div className="h-4 w-8 bg-gray-200 rounded" />
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-4 w-48 bg-gray-200 rounded flex-1" />
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex justify-center gap-2 mt-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 w-10 bg-gray-200 rounded-lg" />
                ))}
            </div>
        </div>
    );
}
