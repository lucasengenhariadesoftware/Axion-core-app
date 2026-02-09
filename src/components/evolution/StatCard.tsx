import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon?: LucideIcon;
    trend?: number;
    trendLabel?: string;
    previousValue?: string | number;
    color?: 'blue' | 'purple' | 'green' | 'default';
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    unit,
    icon: Icon,
    trend,
    trendLabel,
    color = 'default'
}) => {
    const isPositive = trend && trend > 0;
    const isNegative = trend && trend < 0;
    const isNeutral = !trend || trend === 0;

    const colorClasses = {
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        green: 'text-emerald-400',
        default: 'text-slate-400'
    };

    return (
        <div className="glass-panel p-4 flex flex-col justify-between h-full card-hover relative overflow-hidden group">
            {/* Background glow effect */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-${color === 'default' ? 'slate' : color}-500/10 to-transparent rounded-full blur-2xl group-hover:from-${color === 'default' ? 'slate' : color}-500/20 transition-all duration-500`} />

            <div className="flex justify-between items-start mb-2 relative z-10">
                <span className="text-sm font-medium text-slate-400">{title}</span>
                {Icon && <Icon size={18} className={`${colorClasses[color]}`} />}
            </div>

            <div className="relative z-10">
                <div className="flex items-baseline gap-1">
                    <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
                    {unit && <span className="text-sm text-slate-500 font-medium">{unit}</span>}
                </div>

                {(trend !== undefined) && (
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' :
                                isNegative ? 'bg-rose-500/10 text-rose-400' :
                                    'bg-slate-500/10 text-slate-400'
                            }`}>
                            {isPositive && <ArrowUpRight size={12} className="mr-0.5" />}
                            {isNegative && <ArrowDownRight size={12} className="mr-0.5" />}
                            {isNeutral && <Minus size={12} className="mr-0.5" />}
                            {Math.abs(trend)}%
                        </div>
                        {trendLabel && <span className="text-xs text-slate-500">{trendLabel}</span>}
                    </div>
                )}
            </div>
        </div>
    );
};
