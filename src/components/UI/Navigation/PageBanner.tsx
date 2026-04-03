"use client";

import { useEffect, useState } from "react";

interface PageBannerProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
}

export function PageBanner({
    title,
    subtitle,
    backgroundImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"
}: PageBannerProps) {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background with Parallax */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('${backgroundImage}')`,
                    transform: `translateY(${offset * 0.5}px)`
                }}
            ></div>

            {/* Overlays */}
            <div className="absolute inset-0 z-10 bg-black/40"></div>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-20 text-center text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight drop-shadow-lg">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light drop-shadow-md">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}


