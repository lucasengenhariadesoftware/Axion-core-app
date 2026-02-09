import React from 'react';
import { BodyRecord } from '../../store/evolutionStore';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ComparisonCardProps {
    current: BodyRecord;
    previous?: BodyRecord;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ current, previous }) => {
    const weightDiff = previous ? current.weight - previous.weight : 0;

    const renderDiff = (diff: number, inverse = false) => {
        if (!previous) return null;
        if (Math.abs(diff) < 0.1) return <div className="cmp-pill"><Minus size={12} /> 0.0</div>;

        const isPositive = diff > 0;
        const isGood = inverse ? isPositive : !isPositive;
        const Icon = isPositive ? ArrowUp : ArrowDown;

        return (
            <div className={`cmp-pill ${isGood ? 'good' : 'bad'}`}>
                <Icon size={12} /> {Math.abs(diff).toFixed(1)}
            </div>
        );
    };

    return (
        <div className="comparison-card">
            <div className="cmp-header">
                <div>
                    <div className="cmp-label">DATA ATUAL</div>
                    <strong style={{ fontSize: '18px' }}>
                        {format(new Date(current.date), 'dd MMMM', { locale: ptBR })}
                    </strong>
                </div>
                {previous && (
                    renderDiff(weightDiff)
                )}
            </div>

            <div className="cmp-grid">
                <div className="cmp-item">
                    <div className="cmp-label">PESO</div>
                    <div className="cmp-value-row">
                        <span className="cmp-value">
                            {current.weight} <span className="cmp-unit">kg</span>
                        </span>
                    </div>
                </div>

                <div className="cmp-item">
                    <div className="cmp-label">CINTURA</div>
                    <div className="cmp-value-row">
                        <span className="cmp-value">
                            {current.measures?.waist || '-'} <span className="cmp-unit">cm</span>
                        </span>
                        {previous && current.measures?.waist && previous.measures?.waist &&
                            renderDiff(current.measures.waist - previous.measures.waist)}
                    </div>
                </div>
            </div>
        </div>
    );
};
