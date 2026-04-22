import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
    if (!items || items.length === 0) return null;

    return (
        <nav className={`flex items-center space-x-2 text-sm text-gray-500 mb-6 ${className}`} aria-label="Breadcrumb">
            <Link
                href="/"
                className="flex items-center hover:text-primary transition-colors"
            >
                <Home className="w-4 h-4" />
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    {item.path ? (
                        <Link
                            href={item.path}
                            className="hover:text-primary transition-colors font-medium"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-bold">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
