
import React, { useState, useMemo } from 'react';
import { TrendItem } from '../types';

interface TrendsTableProps {
    data: TrendItem[];
}

type SortKey = keyof TrendItem;
type SortOrder = 'asc' | 'desc';

const SortableHeader: React.FC<{
    column: SortKey;
    sortConfig: { key: SortKey; order: SortOrder } | null;
    handleSort: (key: SortKey) => void;
    children: React.ReactNode;
}> = ({ column, sortConfig, handleSort, children }) => {
    const isSorted = sortConfig && sortConfig.key === column;
    const arrow = isSorted ? (sortConfig.order === 'asc' ? '▲' : '▼') : '';
    return (
        <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort(column)}
        >
            {children} {arrow}
        </th>
    );
};


const TrendsTable: React.FC<TrendsTableProps> = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder } | null>({ key: 'score', order: 'desc' });

    const handleSort = (key: SortKey) => {
        let order: SortOrder = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.order === 'asc') {
            order = 'desc';
        }
        setSortConfig({ key, order });
    };
    
    const sortedAndFilteredData = useMemo(() => {
        let filteredData = [...data];

        if (searchTerm) {
            filteredData = filteredData.filter(item =>
                item.term.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortConfig !== null) {
            filteredData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === null && bValue === null) return 0;
                if (aValue === null) return sortConfig.order === 'asc' ? -1 : 1;
                if (bValue === null) return sortConfig.order === 'asc' ? 1 : -1;
                
                // Numeric comparison for score and rank
                if (sortConfig.key === 'score' || sortConfig.key === 'rank') {
                    const numA = Number(aValue);
                    const numB = Number(bValue);
                    if (numA < numB) return sortConfig.order === 'asc' ? -1 : 1;
                    if (numA > numB) return sortConfig.order === 'asc' ? 1 : -1;
                    return 0;
                }

                // String comparison for others
                if (aValue < bValue) return sortConfig.order === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.order === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filteredData;
    }, [data, searchTerm, sortConfig]);

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by term..."
                    className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader column="term" sortConfig={sortConfig} handleSort={handleSort}>Term</SortableHeader>
                            <SortableHeader column="rank" sortConfig={sortConfig} handleSort={handleSort}>Rank</SortableHeader>
                            <SortableHeader column="score" sortConfig={sortConfig} handleSort={handleSort}>Score</SortableHeader>
                            <SortableHeader column="week" sortConfig={sortConfig} handleSort={handleSort}>Week</SortableHeader>
                            <SortableHeader column="refresh_date" sortConfig={sortConfig} handleSort={handleSort}>Refresh Date</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedAndFilteredData.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.term}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.rank}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.score !== null ? item.score : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.week}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.refresh_date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrendsTable;
