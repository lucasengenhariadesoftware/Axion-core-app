import { useState } from 'react';
import { ChefHat, Plus, X, Check } from 'lucide-react';
import { useDietStore } from '../../store/dietStore';
import { generateFridgeMeal } from '../../lib/dietLogic';

export default function FridgeMode({ onClose }: { onClose: () => void }) {
    const { learningProfile, addToPantry, removeFromPantry } = useDietStore();
    const [generatedMeal, setGeneratedMeal] = useState<any[] | null>(null);

    // Mock de itens comuns de despensa para seleção rápida
    const commonItems = [
        { id: 'p_egg_boiled', name: 'Ovos' },
        { id: 'p_chk_breast', name: 'Frango' },
        { id: 'c_rice_white', name: 'Arroz' },
        { id: 'v_mix_leaves', name: 'Alface' },
        { id: 'c_bread_whole', name: 'Pão' },
        { id: 'd_milk', name: 'Leite' },
    ];

    const generate = () => {
        const meal = generateFridgeMeal(learningProfile.pantry, 'lunch'); // Default lunch for demo
        setGeneratedMeal(meal);
    };

    return (
        <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, top: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 100,
            display: 'flex', alignItems: 'flex-end'
        }}>
            <div className="animate-slide-up" style={{
                background: 'white',
                width: '100%',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '24px 24px 90px 24px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#ECFDF5', padding: '10px', borderRadius: '12px' }}>
                            <ChefHat color="#10B981" size={24} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0 }}>Modo Geladeira</h2>
                    </div>
                    <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={20} color="#6B7280" />
                    </button>
                </div>

                {!generatedMeal ? (
                    <>
                        <p style={{ color: '#6B7280', marginBottom: '20px' }}>
                            Selecione o que você tem em casa e a IA montará uma refeição equilibrada.
                        </p>

                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Sua Despensa</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                            {commonItems.map(item => {
                                const isSelected = learningProfile.pantry.includes(item.id);
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => isSelected ? removeFromPantry([item.id]) : addToPantry([item.id])}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            border: isSelected ? 'none' : '1px solid #E5E7EB',
                                            background: isSelected ? '#10B981' : 'white',
                                            color: isSelected ? 'white' : '#6B7280',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            boxShadow: isSelected ? '0 2px 4px rgba(16, 185, 129, 0.2)' : 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {isSelected ? <Check size={14} /> : <Plus size={14} />}
                                        {item.name}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={generate}
                            disabled={learningProfile.pantry.length === 0}
                            style={{
                                width: '100%',
                                background: '#10B981',
                                color: 'white',
                                padding: '16px',
                                borderRadius: '16px',
                                border: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                opacity: learningProfile.pantry.length === 0 ? 0.5 : 1
                            }}
                        >
                            Gerar Refeição Mágica ✨
                        </button>
                    </>
                ) : (
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>Sugestão do Chef</h3>
                        <div style={{ background: '#F9FAFB', borderRadius: '16px', padding: '16px', marginBottom: '24px' }}>
                            {generatedMeal.length > 0 ? generatedMeal.map((item, idx) => (
                                <div key={idx} style={{ padding: '8px 0', borderBottom: idx < generatedMeal.length - 1 ? '1px solid #E5E7EB' : 'none', fontWeight: 600, color: '#374151' }}>
                                    {item.name} <span style={{ fontWeight: 400, color: '#9CA3AF' }}>({item.portion})</span>
                                </div>
                            )) : <p>Não consegui montar algo completo. Adicione mais proteínas ou carboidratos.</p>}
                        </div>
                        <button
                            onClick={() => setGeneratedMeal(null)}
                            style={{ width: '100%', padding: '16px', background: '#F3F4F6', color: '#374151', borderRadius: '16px', fontWeight: 700, border: 'none' }}
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
