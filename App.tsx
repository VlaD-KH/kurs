
import React, { useMemo, useState } from 'react';
import { trendsData } from './data';
import { TrendItem } from './types';
import DashboardHeader from './components/DashboardHeader';
import StatCard from './components/StatCard';
import TrendsLineChart from './components/TrendsLineChart';
import TopTermsBarChart from './components/TopTermsBarChart';
import TrendsTable from './components/TrendsTable';

const App: React.FC = () => {
    const queryInfo = {
        country: 'Ukraine',
        region: 'Donetsk Oblast',
        term: '%2025%',
        year: '2025'
    };

    const {
        uniqueTermsCount,
        topTerm,
        averageScore,
        dateRange
    } = useMemo(() => {
        if (!trendsData || trendsData.length === 0) {
            return {
                uniqueTermsCount: 0,
                topTerm: 'N/A',
                averageScore: 0,
                dateRange: 'N/A'
            };
        }

        const uniqueTerms = new Set(trendsData.map(d => d.term));

        const topTermItem = [...trendsData]
            .filter(d => d.score !== null)
            .sort((a, b) => {
                const scoreA = Number(a.score);
                const scoreB = Number(b.score);
                if (scoreB !== scoreA) {
                    return scoreB - scoreA;
                }
                return Number(a.rank) - Number(b.rank);
            })[0];

        const scores = trendsData.map(d => Number(d.score)).filter(s => !isNaN(s) && s !== null);
        const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

        const weeks = trendsData.map(d => new Date(d.week));
        const minDate = new Date(Math.min(...weeks.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...weeks.map(d => d.getTime())));
        const dateRangeStr = `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;

        return {
            uniqueTermsCount: uniqueTerms.size,
            topTerm: topTermItem ? topTermItem.term : 'N/A',
            averageScore: Math.round(avgScore),
            dateRange: dateRangeStr
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 lg:p-8">
            <DashboardHeader queryInfo={queryInfo} />

            <main>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Unique Terms" value={uniqueTermsCount.toString()} />
                    <StatCard title="Top Term (by Score)" value={topTerm} />
                    <StatCard title="Average Score" value={averageScore.toString()} />
                    <StatCard title="Date Range" value={dateRange} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                    <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Score Over Time (Top 5 Terms)</h3>
                        <TrendsLineChart data={trendsData} />
                    </div>
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Top 10 Terms by Max Score</h3>
                        <TopTermsBarChart data={trendsData} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-xl font-semibold mb-4 text-gray-700">Detailed Trends Data</h3>
                    <TrendsTable data={trendsData} />
                </div>
            </main>
        </div>
    );
};

export default App;
