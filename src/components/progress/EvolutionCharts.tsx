import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EvolutionChartsProps {
    data: any[];
    dataKey: string;
    color?: string;
    unit?: string;
}

export const EvolutionCharts: React.FC<EvolutionChartsProps> = ({
    data,
    dataKey,
    color = "#22c55e",
    unit = "kg"
}) => {
    // Sort data strictly by date for chart (oldest first)
    const chartData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-400">Sem dados suficientes para o gráfico</p>
            </div>
        );
    }

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: ptBR })}
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={['auto', 'auto']}
                        padding={{ top: 20, bottom: 20 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        labelFormatter={(label) => format(new Date(label), 'dd MMM yyyy', { locale: ptBR })}
                        formatter={(value: number) => [`${value} ${unit}`, 'Valor']}
                    />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        fillOpacity={1}
                        fill={`url(#color${dataKey})`}
                        strokeWidth={3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
