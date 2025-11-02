import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendItem } from '../types';

interface TrendsLineChartProps {
    data: TrendItem[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

const TrendsLineChart: React.FC<TrendsLineChartProps> = ({ data }) => {

    const { chartData, topTerms } = useMemo(() => {
        if (!data) return { chartData: [], topTerms: [] };

        const termScores = new Map<string, number>();
        data.forEach(item => {
            if (item.score !== null) {
                const currentMax = termScores.get(item.term) || 0;
                if (Number(item.score) > currentMax) {
                    termScores.set(item.term, Number(item.score));
                }
            }
        });

        const sortedTopTerms = Array.from(termScores.entries())
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
            .slice(0, 5)
            .map(([term]) => term);
            
        const weeks = [...new Set(data.map(item => item.week))].sort();
        
        const processedData = weeks.map(week => {
            // FIX: Allow null values for data points to support missing data for certain weeks.
            // This is required for the `connectNulls` prop on the Line component to work correctly.
            const dataPoint: { [key: string]: string | number | null } = { week };
            sortedTopTerms.forEach(term => {
                const item = data.find(d => d.week === week && d.term === term);
                dataPoint[term] = item && item.score ? Number(item.score) : null;
            });
            return dataPoint;
        });

        return { chartData: processedData, topTerms: sortedTopTerms };
    }, [data]);

    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No data available for chart.</div>;
    }

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {topTerms.map((term, index) => (
                        <Line key={term} type="monotone" dataKey={term} stroke={COLORS[index % COLORS.length]} connectNulls />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendsLineChart;