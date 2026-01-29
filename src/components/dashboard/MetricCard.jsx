import React from 'react';
import clsx from 'clsx';
import { MoreHorizontal } from 'lucide-react';

const MetricCard = ({ title, status, value, unit, children, className }) => {
    return (
        <div className={clsx("bg-white p-6 rounded-xl shadow-sm border border-slate-100", className)}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
                        {status && (
                            <span className={clsx(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                status === 'Live' ? "bg-red-100 text-red-600 animate-pulse" : "bg-green-100 text-green-600"
                            )}>
                                {status}
                            </span>
                        )}
                    </div>
                    <div className="mt-1 flex items-baseline space-x-1">
                        <span className="text-3xl font-bold text-slate-900">{value}</span>
                        {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>
            {children}
        </div>
    );
};

export default MetricCard;
