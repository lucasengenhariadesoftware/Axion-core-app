import React from 'react';
import { Dumbbell, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

export const ExerciseEvolution: React.FC = () => {
    return (
        <div style={{ padding: '0 16px', textAlign: 'center', marginTop: '40px' }}>
            <div style={{
                width: '64px', height: '64px', backgroundColor: '#F1F5F9', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                color: '#94a3b8'
            }}>
                <Dumbbell size={32} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                Evolução de Cargas
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: '1.5' }}>
                Acompanhe o aumento da sua força nos principais exercícios (Supino, Agachamento, etc).
            </p>

            <Button className="w-full flex items-center justify-center gap-2">
                <Plus size={18} />
                Adicionar Exercício
            </Button>

            {/* Example List Placeholder */}
            <div style={{ marginTop: '32px', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Exemplos (Em breve)
                </p>
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #f0f0f0', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>Supino Reto</span>
                        <span style={{ fontWeight: 700, color: '#10b981' }}>+12%</span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: '70%', height: '100%', backgroundColor: '#10b981' }} />
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                        Início: 20kg → Atual: 60kg
                    </div>
                </div>
            </div>
        </div>
    );
};
