import { useState } from 'react';
import { RefreshCw, CheckCircle2, Circle, Zap, Wallet, Timer } from 'lucide-react';
import { Meal } from '../../types/diet';
import { getSmartSubstitutions } from '../../lib/dietLogic';
import { useUserStore } from '../../store/userStore';

interface MealCardProps {
    meal: Meal;
}

export default function MealCard({ meal }: MealCardProps) {
    const { toggleMeal, swapMealItem } = useUserStore();
    const [swappingItem, setSwappingItem] = useState<string | null>(null);
    const [subCriteria, setSubCriteria] = useState<'protein' | 'cheaper' | 'faster'>('protein');

    return (
        <div id={`meal-${meal.id}`} style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: meal.done ? '1px solid #10B981' : '1px solid transparent',
            opacity: meal.done ? 0.8 : 1,
            transition: 'all 0.3s ease'
        }}>
            {/* Header */}
            <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', cursor: 'pointer' }}
                onClick={() => toggleMeal(meal.id)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: meal.done ? '#ECFDF5' : '#F3F4F6',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: meal.done ? '#10B981' : '#6B7280',
                        fontWeight: 700, fontSize: '0.8rem'
                    }}>
                        {meal.time}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{meal.name}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>{meal.prepTimeMinutes} min • {(meal.items || []).length} itens</p>
                    </div>
                </div>
                {meal.done ? <CheckCircle2 size={24} color="#10B981" fill="#ECFDF5" /> : <Circle size={24} color="#D1D5DB" />}
            </div>

            {/* Items List */}
            {!meal.done && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                    {(meal.items || []).map(item => (
                        <div key={item.id} style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '2px' }}>{item.portion}</div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSwappingItem(swappingItem === item.id ? null : item.id); }}
                                    style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                                >
                                    <RefreshCw size={16} />
                                </button>
                            </div>

                            {/* Swap Overlay */}
                            {swappingItem === item.id && (
                                <div className="animate-fade-in" style={{
                                    marginTop: '8px',
                                    background: '#F9FAFB',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    border: '1px solid #E5E7EB',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', margin: 0 }}>
                                            Substituição Inteligente
                                        </p>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button
                                                onClick={() => setSubCriteria('protein')}
                                                title="Equivalente Proteico"
                                                style={{ padding: '6px', borderRadius: '8px', border: 'none', background: subCriteria === 'protein' ? '#E0E7FF' : 'white', color: subCriteria === 'protein' ? '#4338CA' : '#9CA3AF', cursor: 'pointer' }}
                                            >
                                                <Zap size={14} />
                                            </button>
                                            <button
                                                onClick={() => setSubCriteria('cheaper')}
                                                title="Mais Econômico"
                                                style={{ padding: '6px', borderRadius: '8px', border: 'none', background: subCriteria === 'cheaper' ? '#DCFCE7' : 'white', color: subCriteria === 'cheaper' ? '#15803D' : '#9CA3AF', cursor: 'pointer' }}
                                            >
                                                <Wallet size={14} />
                                            </button>
                                            <button
                                                onClick={() => setSubCriteria('faster')}
                                                title="Mais Rápido"
                                                style={{ padding: '6px', borderRadius: '8px', border: 'none', background: subCriteria === 'faster' ? '#FEF3C7' : 'white', color: subCriteria === 'faster' ? '#B45309' : '#9CA3AF', cursor: 'pointer' }}
                                            >
                                                <Timer size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {getSmartSubstitutions(item, subCriteria).slice(0, 3).map(sub => (
                                            <button
                                                key={sub.id}
                                                onClick={() => {
                                                    swapMealItem(meal.id, item.id, sub);
                                                    setSwappingItem(null);
                                                }}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '10px 12px',
                                                    background: 'white',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '10px',
                                                    fontSize: '0.9rem',
                                                    color: '#374151',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <span style={{ fontWeight: 500 }}>{sub.name}</span>
                                                <span style={{ color: '#6B7280', fontSize: '0.8rem', background: '#F3F4F6', padding: '2px 6px', borderRadius: '6px' }}>{sub.portion}</span>
                                            </button>
                                        ))}
                                        {getSmartSubstitutions(item, subCriteria).length === 0 && (
                                            <p style={{ fontSize: '0.85rem', color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center', padding: '8px' }}>Nenhuma opção encontrada para este filtro.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
