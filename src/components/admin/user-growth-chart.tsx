"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UserGrowthChartProps {
    data: Array<{
        date: string;
        parents: number;
        students: number;
    }>;
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
    // Format date for display
    const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                    dataKey="date"
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
                <Line
                    type="monotone"
                    dataKey="parents"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Parents"
                    dot={{ fill: '#3b82f6', r: 4 }}
                />
                <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Students"
                    dot={{ fill: '#10b981', r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
