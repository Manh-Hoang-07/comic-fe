"use client";

import { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format } from "date-fns";
import { AdminViewHistoryItem } from "@/types/comic";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface StatsChartProps {
    viewHistory: AdminViewHistoryItem[];
}

export default function StatsChart({ viewHistory }: StatsChartProps) {
    const chartData = useMemo(() => ({
        labels: viewHistory.map(item => format(new Date(item.date), "dd/MM")),
        datasets: [
            {
                label: 'Lượt xem',
                data: viewHistory.map(item => item.count),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    }), [viewHistory]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f3f4f6' },
            },
            x: {
                grid: { display: false },
            },
        },
    };

    return <Bar data={chartData} options={chartOptions} />;
}
