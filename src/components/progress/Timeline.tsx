import React from 'react';
import { BodyRecord } from '../../store/evolutionStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';

interface TimelineProps {
    records: BodyRecord[];
}

export const Timeline: React.FC<TimelineProps> = ({ records }) => {
    if (records.length === 0) return null;

    return (
        <section className="timeline-section">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>Linha do Tempo</h3>
            <div className="timeline-container">
                {records.map((record) => (
                    <div key={record.id} className="timeline-item">
                        <div className="timeline-dot" />
                        <div className="timeline-date">
                            {format(new Date(record.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                        </div>
                        <div className="timeline-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                                        {record.weight} kg
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                                        {record.notes ? `"${record.notes}"` : 'Registro de evolução'}
                                    </div>
                                    {record.measures?.waist && (
                                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                            Cintura: {record.measures.waist}cm
                                        </div>
                                    )}
                                </div>
                                <ChevronRight size={16} color="#94a3b8" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
