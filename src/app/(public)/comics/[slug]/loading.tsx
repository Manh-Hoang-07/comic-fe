import "@/styles/comic.css";

export default function Loading() {
    return (
        <main className="bg-[#f8f9fa] min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb Skeleton */}
                <div className="h-4 w-64 bg-gray-200 rounded mb-6 animate-pulse" />

                <div className="flex flex-col lg:flex-row gap-8 mb-12">
                    {/* Cover Image Skeleton */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="aspect-[2/3] rounded-2xl bg-gray-200 animate-pulse border-4 border-white shadow-2xl" />
                    </div>

                    {/* Basic Info Skeleton */}
                    <div className="flex-1 space-y-4">
                        <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />

                        <div className="flex gap-2 mb-6">
                            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                        </div>

                        <div className="space-y-5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 mb-8 pt-4">
                            <div className="h-12 w-40 bg-gray-200 rounded-full animate-pulse" />
                            <div className="h-12 w-32 bg-gray-200 rounded-full animate-pulse" />
                        </div>

                        <div className="h-32 bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
