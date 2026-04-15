export default function AuthLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 animate-pulse">
            <div className="w-full max-w-md p-8 bg-white rounded-xl border border-gray-100 space-y-6">
                {/* Logo */}
                <div className="h-12 w-32 bg-gray-200 rounded mx-auto" />

                {/* Title */}
                <div className="h-7 w-40 bg-gray-200 rounded mx-auto" />

                {/* Form fields */}
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                        <div className="h-11 w-full bg-gray-200 rounded-lg" />
                    </div>
                ))}

                {/* Button */}
                <div className="h-11 w-full bg-gray-200 rounded-lg" />

                {/* Link */}
                <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
            </div>
        </div>
    );
}
