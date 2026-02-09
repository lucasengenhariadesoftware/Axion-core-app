import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

interface HistoryItem {
    id: string;
    date: string;
    weight: number;
    change?: number; // Change from previous record
}

interface HistoryTimelineProps {
    history: HistoryItem[];
    onViewDetails: (id: string) => void;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ history, onViewDetails }) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-100">History</h3>
                <button className="text-sm text-slate-400 hover:text-white transition-colors">See all</button>
            </div>

            <div className="space-y-3">
                {history.map((item, index) => (
                    <div
                        key={item.id}
                        onClick={() => onViewDetails(item.id)}
                        className="group flex items-center p-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-slate-700/50"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                            <Calendar size={18} />
                        </div>

                        <div className="ml-3 flex-1">
                            <h4 className="text-sm font-medium text-slate-200">{item.date}</h4>
                            <p className="text-xs text-slate-500">Body Record</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <span className="block text-sm font-bold text-slate-200">{item.weight} kg</span>
                                {item.change !== undefined && item.change !== 0 && (
                                    <span className={`text-xs ${item.change > 0 ? 'text-emerald-400' : 'text-emerald-400'}`}>
                                        {item.change > 0 ? '+' : ''}{item.change} kg
                                    </span>
                                )}
                            </div>
                            <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
