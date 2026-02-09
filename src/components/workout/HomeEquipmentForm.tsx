import React, { useState } from 'react';
import { Check, Dumbbell, Home, User, Trophy } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { Equipment } from '../../types/workout';
import { Button } from '../ui/Button';

interface HomeEquipmentFormProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export const HomeEquipmentForm: React.FC<HomeEquipmentFormProps> = ({ onConfirm, onCancel }) => {
    const { profile, updateProfile } = useUserStore();
    const [selectedLevel, setSelectedLevel] = useState<number>(() => {
        // Infer initial level
        const eq = profile?.homeEquipment || [];
        if (eq.includes('rack')) return 3;
        if (eq.includes('bench')) return 2;
        if (eq.includes('home_dumbbells')) return 1;
        return 0;
    });

    const levels = [
        {
            lvl: 0,
            title: "Apenas Corpo",
            desc: "Sem equipamentos, apenas espaço",
            items: "Chão, parede, móveis básicos",
            icon: <User size={24} className="text-blue-500" />,
            color: "from-blue-50 to-blue-100",
            border: "border-blue-200"
        },
        {
            lvl: 1,
            title: "Equipamento Básico",
            desc: "Elásticos, halteres leves, corda",
            items: "Elásticos, halteres < 10kg, corda",
            icon: <Dumbbell size={24} className="text-green-500" />,
            color: "from-green-50 to-green-100",
            border: "border-green-200"
        },
        {
            lvl: 2,
            title: "Intermediário",
            desc: "Kit completo caseiro",
            items: "Barra porta, kettlebells, banco",
            icon: <Trophy size={24} className="text-orange-500" />,
            color: "from-orange-50 to-orange-100",
            border: "border-orange-200"
        },
        {
            lvl: 3,
            title: "Academia em Casa",
            desc: "Equipamento profissional",
            items: "Rack, barra olímpica, anilhas",
            icon: <Home size={24} className="text-purple-500" />,
            color: "from-purple-50 to-purple-100",
            border: "border-purple-200"
        }
    ];

    const handleSave = () => {
        let equipment: Equipment[] = [];
        switch (selectedLevel) {
            case 0: equipment = ['bodyweight_only']; break;
            case 1: equipment = ['bodyweight_only', 'home_dumbbells', 'resistance_band']; break;
            case 2: equipment = ['bodyweight_only', 'home_dumbbells', 'resistance_band', 'kettlebell', 'pull_up_bar', 'bench']; break;
            case 3: equipment = ['bodyweight_only', 'home_dumbbells', 'resistance_band', 'kettlebell', 'pull_up_bar', 'bench', 'rack']; break;
            default: equipment = ['bodyweight_only'];
        }
        updateProfile({ homeEquipment: equipment });
        onConfirm();
    };

    return (
        <div style={{
            background: '#F8FAFC',
            borderRadius: '16px',
            padding: '16px',
            marginTop: '8px',
            border: '1px solid #E2E8F0'
        }}>
            <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>Configurar Treino em Casa</h3>
                <p style={{ fontSize: '12px', color: '#64748B' }}>Selecione o equipamento que você tem disponível</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                marginBottom: '16px'
            }}>
                {levels.map((level) => {
                    const isSelected = selectedLevel === level.lvl;
                    return (
                        <div
                            key={level.lvl}
                            onClick={() => setSelectedLevel(level.lvl)}
                            style={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: '12px 8px',
                                borderRadius: '12px',
                                border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                                background: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                boxShadow: isSelected ? '0 4px 6px rgba(37, 99, 235, 0.1)' : 'none'
                            }}
                        >
                            {isSelected && (
                                <div style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    background: '#2563EB',
                                    color: 'white',
                                    borderRadius: '50%',
                                    padding: '2px',
                                    display: 'flex'
                                }}>
                                    <Check size={10} strokeWidth={3} />
                                </div>
                            )}

                            <div style={{
                                marginBottom: '8px',
                                padding: '8px',
                                borderRadius: '50%',
                                background: isSelected ? '#EFF6FF' : '#F1F5F9' // lighter blue vs slate
                            }}>
                                {level.icon}
                            </div>

                            <h3 style={{
                                fontWeight: 700,
                                fontSize: '11px',
                                marginBottom: '2px',
                                color: isSelected ? '#1E3A8A' : '#1E293B',
                                lineHeight: '1.2'
                            }}>
                                {level.title}
                            </h3>
                            <span style={{
                                fontSize: '9px',
                                color: '#94A3B8',
                                fontWeight: 500,
                                background: '#F8FAFC',
                                padding: '2px 6px',
                                borderRadius: '99px',
                                marginTop: '4px'
                            }}>
                                {level.items.split(',')[0]} +
                            </span>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button
                    onClick={handleSave}
                    fullWidth
                    size="sm"
                    style={{ background: 'var(--color-success)', color: 'white', fontWeight: 700 }}
                >
                    Confirmar Seleção
                </Button>
                <div
                    onClick={onCancel}
                    style={{
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#64748B',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '8px'
                    }}
                >
                    Fechar
                </div>
            </div>
        </div>
    );
};
