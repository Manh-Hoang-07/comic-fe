import Link from "next/link";
import { Button } from "@/components/UI/Navigation/Button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
            <div className="space-y-4">
                <h1 className="text-9xl font-extrabold text-primary opacity-20">404</h1>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
                    Page not found
                </h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
                </p>
                <div className="pt-8">
                    <Link href="/">
                        <Button size="lg">Back to Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}


