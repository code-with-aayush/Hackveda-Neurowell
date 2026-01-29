import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const StressGauge = ({ value, min = 0, max = 10 }) => {
    // Normalize value to percentage for the gauge
    const percentage = (value - min) / (max - min);

    // Data for the gauge: [Filled, Empty]
    const data = [
        { value: percentage },
        { value: 1 - percentage }
    ];

    // Color logic based on stress level
    const getColor = (val) => {
        if (val < 4) return '#22C55E'; // Green
        if (val < 7) return '#EAB308'; // Yellow/Orange
        return '#EF4444'; // Red
    };

    const activeColor = getColor(value);

    return (
        <div className="relative h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                    >
                        <Cell key="cell-0" fill={activeColor} cornerRadius={10} />
                        <Cell key="cell-1" fill="#E2E8F0" />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center mt-4">
                <div className="text-4xl font-bold text-slate-800">{value}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {value < 4 ? 'Low' : value < 7 ? 'Moderate' : 'High'}
                </div>
            </div>
        </div>
    );
};

export default StressGauge;
