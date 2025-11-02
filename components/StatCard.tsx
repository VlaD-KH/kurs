
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-sm font-medium text-gray-500">{title}</h4>
            <p className="text-2xl font-bold text-gray-800 mt-1 truncate" title={value}>{value}</p>
        </div>
    );
};

export default StatCard;
