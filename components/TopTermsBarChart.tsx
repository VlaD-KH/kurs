
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendItem } from '../types';

interface TopTermsBarChartProps {
    data: TrendItem[];
}

const TopTermsBarChart: React.FC<TopTermsBarChartProps> = ({ data }) => {

    const chartData = useMemo(() => {
        const termMaxScores = new Map<string, number>();
        data.forEach(item => {
            if (item.score !== null) {
                const score = Number(item.score);
                const currentMax = termMaxScores.get(item.term) || 0;
                if (score > currentMax) {
                    termMaxScores.set(item.term, score);
                }
            }
        });
        
        return Array.from(termMaxScores.entries())
            .map(([term, maxScore]) => ({ term, maxScore }))
            .sort((a, b) => b.maxScore - a.maxScore)
            .slice(0, 10);

    }, [data]);

    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No data available for chart.</div>;
    }

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart
                    layout="vertical"
                    data={chartData}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="term" type="category" width={150} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="maxScore" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopTermsBarChart;
