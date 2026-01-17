"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
    data: Array<{
        plan: string;
        count: number;
    }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
    const PRICING = { FREE: 0, PREMIUM: 10, FAMILY: 15 };

    const chartData = data.map(item => ({
        plan: item.plan,
        count: item.count,
        revenue: item.count * PRICING[item.plan as keyof typeof PRICING],
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                    dataKey="plan"
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <Legend />
                <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    name="Subscriptions"
                    radius={[8, 8, 0, 0]}
                />
                <Bar
                    dataKey="revenue"
                    fill="#10b981"
                    name="Revenue ($)"
                    radius={[8, 8, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
