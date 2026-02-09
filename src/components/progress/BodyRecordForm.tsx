import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { BodyMeasures } from '../../types';
import { X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../inputs/Input';
import { Button } from '../ui/Button';

interface BodyRecordFormProps {
    onClose: () => void;
    variant?: 'modal' | 'inline';
}

export const BodyRecordForm: React.FC<BodyRecordFormProps> = ({ onClose, variant = 'modal' }) => {
    const addBodyRecord = useUserStore((state) => state.addBodyRecord);

    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const [measures, setMeasures] = useState<BodyMeasures>({
        neck: 0,
        shoulders: 0,
        chest: 0,
        waist: 0,
        abdomen: 0,
        hips: 0,
        armRight: 0,
        armLeft: 0,
        forearmRight: 0,
        forearmLeft: 0,
        thighRight: 0,
        thighLeft: 0,
        calfRight: 0,
        calfLeft: 0,
    });

    const handleMeasureChange = (key: keyof BodyMeasures, value: string) => {
        setMeasures(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (addBodyRecord) {
            addBodyRecord({
                id: Math.random().toString(36).substr(2, 9),
                date,
                weight: parseFloat(weight),
                measures,
                photos: {},
            });
        }
        onClose();
    };

    // Modal Wrapper Styles
    const modalWrapperStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        padding: '16px',
        overflowY: 'auto'
    };

    const content = (
        <Card style={{
            width: '100%',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--space-6)',
            backgroundColor: '#ffffff',
            marginBottom: variant === 'inline' ? '24px' : 0
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <div>
                    <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-main)' }}>Novo Registro</h2>
                    <p style={{ fontSize: 'var(--text-ms)', color: 'var(--color-text-secondary)' }}>Atualize suas medidas</p>
                </div>
                {variant === 'modal' && (
                    <button onClick={onClose} style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px'
                    }}>
                        <X size={24} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} style={{ flex: 1, paddingRight: '4px' }}>

                {/* Date and Weight */}
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
                    <div style={{ flex: 1 }}>
                        <Input
                            label="Data"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Input
                            label="Peso (kg)"
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            style={{ fontWeight: 700, color: 'var(--color-accent)' }}
                        />
                    </div>
                </div>

                <div style={{ width: '100%', height: '1px', background: 'var(--color-surface-alt)', margin: 'var(--space-4) 0' }} />

                {/* SUPERIOR BODY */}
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 'var(--space-4)' }}>
                    Tronco e Superiores (cm)
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <Input label="Pescoço" type="number" onChange={(e) => handleMeasureChange('neck', e.target.value)} />
                    <Input label="Ombros" type="number" onChange={(e) => handleMeasureChange('shoulders', e.target.value)} />
                    <Input label="Peitoral" type="number" onChange={(e) => handleMeasureChange('chest', e.target.value)} />
                    <Input label="Cintura" type="number" onChange={(e) => handleMeasureChange('waist', e.target.value)} />
                    <Input label="Abdômen" type="number" onChange={(e) => handleMeasureChange('abdomen', e.target.value)} />
                    <Input label="Quadril" type="number" onChange={(e) => handleMeasureChange('hips', e.target.value)} />
                </div>

                {/* ARMS */}
                <div style={{ marginTop: 'var(--space-4)' }}>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
                        Braços (Bíceps)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input label="Esquerdo" type="number" onChange={(e) => handleMeasureChange('armLeft', e.target.value)} />
                        <Input label="Direito" type="number" onChange={(e) => handleMeasureChange('armRight', e.target.value)} />
                    </div>
                </div>

                <div style={{ marginTop: 'var(--space-2)' }}>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
                        Antebraços
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input label="Esquerdo" type="number" onChange={(e) => handleMeasureChange('forearmLeft', e.target.value)} />
                        <Input label="Direito" type="number" onChange={(e) => handleMeasureChange('forearmRight', e.target.value)} />
                    </div>
                </div>

                {/* LEGS */}
                <div style={{ marginTop: 'var(--space-4)' }}>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
                        Pernas (Coxa)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input label="Esquerda" type="number" onChange={(e) => handleMeasureChange('thighLeft', e.target.value)} />
                        <Input label="Direita" type="number" onChange={(e) => handleMeasureChange('thighRight', e.target.value)} />
                    </div>
                </div>

                <div style={{ marginTop: 'var(--space-2)' }}>
                    <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
                        Panturrilhas
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input label="Esquerda" type="number" onChange={(e) => handleMeasureChange('calfLeft', e.target.value)} />
                        <Input label="Direita" type="number" onChange={(e) => handleMeasureChange('calfRight', e.target.value)} />
                    </div>
                </div>





            </form>

            <div style={{ paddingTop: 'var(--space-6)', marginTop: 'auto' }}>
                <Button fullWidth onClick={handleSubmit} variant="primary" size="lg">
                    Salvar Registro
                </Button>
            </div>
        </Card>
    );

    if (variant === 'modal') {
        return (
            <div style={modalWrapperStyle}>
                {content}
            </div>
        );
    }

    return content;
};

