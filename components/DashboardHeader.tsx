
import React from 'react';

interface DashboardHeaderProps {
    queryInfo: {
        country: string;
        region: string;
        term: string;
        year: string;
    }
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ queryInfo }) => {
    return (
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Google Trends Dashboard</h1>
            <p className="text-md text-gray-500 mt-1">
                Displaying results for: 
                <span className="font-semibold text-gray-600"> Country:</span> {queryInfo.country},
                <span className="font-semibold text-gray-600"> Region:</span> {queryInfo.region},
                <span className="font-semibold text-gray-600"> Term:</span> '{queryInfo.term}',
                <span className="font-semibold text-gray-600"> Year:</span> {queryInfo.year}
            </p>
        </header>
    );
};

export default DashboardHeader;
