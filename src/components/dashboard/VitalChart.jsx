import React from 'react';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VitalChart = ({ data, title, color = "#3b82f6", dataKey = "value", showStress = false }) => {
    return (
        <div className="w-full h-full min-h-[250px] bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{title}</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <defs>
                            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 10, fill: '#94A3B8' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            hide={false}
                            tick={{ fontSize: 10, fill: '#94A3B8' }}
                            axisLine={false}
                            tickLine={false}
                            domain={['auto', 'auto']}
                        />
                        {showStress && (
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[0, 10]}
                                hide
                            />
                        )}
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#F8FAFC' }}
                            itemStyle={{ color: '#F8FAFC' }}
                            labelStyle={{ color: '#94A3B8' }}
                        />
                        <Legend />

                        {/* Main Metric (e.g. Heart Rate) */}
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey={dataKey}
                            name={title || "Value"}
                            stroke={color}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#gradient-${dataKey})`}
                        />

                        {/* Secondary Metric (Stress) */}
                        {showStress && (
                            <Bar
                                yAxisId="right"
                                dataKey="stress"
                                name="Stress Level"
                                barSize={20}
                                fill="#ef4444"
                                opacity={0.3}
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VitalChart;
