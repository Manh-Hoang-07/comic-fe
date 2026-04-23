"use client";

import React from "react";
import { formatNumber } from "@/utils/formatters";

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    loading?: boolean;
}

export function StatCard({ title, value, icon, color, loading }: StatCardProps) {
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {icon}
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
                </div>
            </div>
        </div>
    );
}
