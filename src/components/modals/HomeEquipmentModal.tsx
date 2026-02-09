import React, { useState } from 'react';
import { X, Check, Dumbbell, Home, User, Trophy } from 'lucide-react'; // Approximating icons
import { useUserStore } from '../../store/userStore';
import { Equipment } from '../../types/workout';
import { Button } from '../ui/Button';

interface HomeEquipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HomeEquipmentModal: React.FC<HomeEquipmentModalProps> = ({ isOpen, onClose }) => {
    const { profile, updateProfile } = useUserStore();
    const [selectedLevel, setSelectedLevel] = useState<number>(() => {
        // Infer initial level
        const eq = profile?.homeEquipment || [];
        if (eq.includes('rack')) return 3;
        if (eq.includes('bench')) return 2;
        if (eq.includes('home_dumbbells')) return 1;
        return 0;
    });

    if (!isOpen) return null;

    const levels = [
        {
            lvl: 0,
            title: "Apenas Corpo",
            desc: "Sem equipamentos, apenas espaço",
            items: "Chão, parede, móveis básicos",
            icon: <User size={32} className="text-blue-500" />,
            color: "from-blue-50 to-blue-100",
            border: "border-blue-200"
        },
        {
            lvl: 1,
            title: "Equipamento Básico",
            desc: "Elásticos, halteres leves, corda",
            items: "Elásticos, halteres < 10kg, corda",
            icon: <Dumbbell size={32} className="text-green-500" />,
            color: "from-green-50 to-green-100",
            border: "border-green-200"
        },
        {
            lvl: 2,
            title: "Intermediário",
            desc: "Kit completo caseiro",
            items: "Barra porta, kettlebells, banco",
            icon: <Trophy size={32} className="text-orange-500" />, // Using Trophy for 'Strong' idea
            color: "from-orange-50 to-orange-100",
            border: "border-orange-200"
        },
        {
            lvl: 3,
            title: "Academia em Casa",
            desc: "Equipamento profissional",
            items: "Rack, barra olímpica, anilhas",
            icon: <Home size={32} className="text-purple-500" />,
            color: "from-purple-50 to-purple-100",
            border: "border-purple-200"
        }
    ];

    const handleConfirm = () => {
        let equipment: Equipment[] = [];
        switch (selectedLevel) {
            case 0: equipment = ['bodyweight_only']; break;
            case 1: equipment = ['bodyweight_only', 'home_dumbbells', 'resistance_band']; break;
            case 2: equipment = ['bodyweight_only', 'home_dumbbells', 'resistance_band', 'kettlebell', 'pull_up_bar', 'bench']; break;
            case 3: equipment = ['bodyweight_only', 'home_dumbbells', 'resistance_band', 'kettlebell', 'pull_up_bar', 'bench', 'rack']; break;
            default: equipment = ['bodyweight_only'];
        }
        updateProfile({ homeEquipment: equipment });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white relative">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Configurar Treino em Casa</h2>
                        <p className="text-sm text-gray-500 mt-1">Selecione o equipamento que você tem disponível</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Grid of Options */}
                <div className="p-6 grid grid-cols-2 gap-4 bg-gray-50/50">
                    {levels.map((level) => {
                        const isSelected = selectedLevel === level.lvl;
                        return (
                            <button
                                key={level.lvl}
                                onClick={() => setSelectedLevel(level.lvl)}
                                className={`
                                    relative flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all duration-200
                                    ${isSelected
                                        ? `bg-white border-blue-600 shadow-md transform scale-[1.02]`
                                        : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm'
                                    }
                                `}
                            >
                                {isSelected && (
                                    <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-0.5">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                )}

                                <div className={`mb-3 p-3 rounded-full bg-gradient-to-br ${level.color} ${isSelected ? 'scale-110' : ''} transition-transform`}>
                                    {level.icon}
                                </div>

                                <h3 className={`font-bold text-sm mb-1 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{level.title}</h3>
                                <p className="text-xs text-gray-500 mb-2 leading-tight">{level.desc}</p>
                                <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-full">
                                    {level.items.split(',')[0]} +
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-gray-100 flex flex-col gap-3">
                    <Button
                        onClick={handleConfirm}
                        fullWidth
                        size="lg"
                        style={{ background: 'var(--color-accent)', color: 'var(--color-primary)' }} // Using theme vars
                    >
                        Confirmar Seleção
                    </Button>
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:text-gray-900 font-medium py-2"
                    >
                        Pular por enquanto
                    </button>
                </div>
            </div>
        </div>
    );
};
