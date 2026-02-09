import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MeasurementChartProps {
    data: any[];
    dataKey: string;
    color?: string;
    label?: string;
}

export const MeasurementChart: React.FC<MeasurementChartProps> = ({
    data,
    dataKey,
    color = '#3b82f6',
    label
}) => {
    if (!data || data.length === 0) {
        return (
            <div className="glass-panel w-full h-64 flex items-center justify-center">
                <span className="text-slate-500 text-sm">Sem dados suficientes para exibir o gráfico</span>
            </div>
        );
    }

    // Calculate domain min/max to auto-scale the charts nicely
    const values = data.map(d => Number(d[dataKey]));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.2; // 20% padding

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-sm">
                    <p className="text-slate-300 text-xs mb-1">{label}</p>
                    <p className="text-white font-bold text-sm">
                        {payload[0].value} <span className="text-xs font-normal text-slate-400">cm</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[300px] mt-4">
            {label && <h4 className="text-sm font-medium text-slate-400 mb-4">{label} Evolution</h4>}
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 0,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.1)" strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        dy={10}
                        minTickGap={30}
                    />
                    <YAxis
                        domain={[min - padding, max + padding]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={2}
                        fill={`url(#gradient-${dataKey})`}
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
