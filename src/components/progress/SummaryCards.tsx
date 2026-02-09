import React from 'react';
import { Scale, Ruler, Trophy, Calendar } from 'lucide-react';
import { BodyRecord } from '../../store/evolutionStore';

interface SummaryCardsProps {
    latestRecord?: BodyRecord;
    previousRecord?: BodyRecord;
    totalRecords: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ latestRecord, previousRecord, totalRecords }) => {

    // Calculates
    const weightDiff = latestRecord && previousRecord
        ? latestRecord.weight - previousRecord.weight
        : 0;

    const waistDiff = latestRecord?.measures?.waist && previousRecord?.measures?.waist
        ? latestRecord.measures.waist - previousRecord.measures.waist
        : 0;

    return (
        <div className="summary-grid">
            {/* Weight Card */}
            <div className="summary-card">
                <div className="sum-icon">
                    <Scale size={16} />
                </div>
                <div className="sum-label">Peso Atual</div>
                <div className="sum-value">
                    {latestRecord ? latestRecord.weight : '--'}
                    <span style={{ fontSize: '14px', fontWeight: 400, marginLeft: '2px', color: '#94a3b8' }}>kg</span>
                </div>
                {latestRecord && previousRecord && (
                    <div className={`sum-diff ${weightDiff <= 0 ? 'diff-positive' : 'diff-negative'}`}>
                        {weightDiff > 0 ? '↑' : '↓'} {Math.abs(weightDiff).toFixed(1)} kg
                    </div>
                )}
            </div>

            {/* Measures Card */}
            <div className="summary-card">
                <div className="sum-icon">
                    <Ruler size={16} />
                </div>
                <div className="sum-label">Cintura</div>
                <div className="sum-value">
                    {latestRecord?.measures?.waist || '--'}
                    <span style={{ fontSize: '14px', fontWeight: 400, marginLeft: '2px', color: '#94a3b8' }}>cm</span>
                </div>
                {latestRecord?.measures?.waist && previousRecord?.measures?.waist && (
                    <div className={`sum-diff ${waistDiff <= 0 ? 'diff-positive' : 'diff-negative'}`}>
                        {waistDiff > 0 ? '↑' : '↓'} {Math.abs(waistDiff).toFixed(1)} cm
                    </div>
                )}
            </div>

            {/* Consistency Card */}
            <div className="summary-card">
                <div className="sum-icon">
                    <Calendar size={16} />
                </div>
                <div className="sum-label">Registros</div>
                <div className="sum-value">{totalRecords}</div>
                <div className="sum-diff diff-neutral" style={{ fontWeight: 400 }}>
                    No total
                </div>
            </div>

            {/* Placeholder for Best Lift (Future) */}
            <div className="summary-card">
                <div className="sum-icon">
                    <Trophy size={16} />
                </div>
                <div className="sum-label">Supino (Max)</div>
                <div className="sum-value">--</div>
                <div className="sum-diff diff-neutral">
                    Sem dados
                </div>
            </div>
        </div>
    );
};
