import { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { useDietStore } from '../../store/dietStore';
import { DietPreferences, Goal, DietType, CookingTime } from '../../types/diet';

export default function DietOnboarding() {
    const setPreferences = useDietStore(state => state.setPreferences);
    const [step, setStep] = useState(1);
    const [prefs, setPrefs] = useState<Partial<DietPreferences>>({
        mealsPerDay: 4,
        allergies: [],
        budget: 'standard',
        isSimpleMode: false
    });

    const next = () => setStep(s => s + 1);
    const finish = () => {
        if (!prefs.goal || !prefs.dietType || !prefs.cookingTime) return;
        setPreferences(prefs as DietPreferences);
    };

    return (
        <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
            <div style={{ flex: 1 }}>

                {/* Progress */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '32px' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                            flex: 1,
                            height: '4px',
                            background: step >= i ? '#10B981' : '#E5E7EB',
                            borderRadius: '2px'
                        }} />
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                            Qual seu objetivo?
                        </h1>
                        <p style={{ color: '#6B7280', marginBottom: '32px' }}>
                            Vamos montar um cardápio focado na sua meta principal.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { id: 'lose_weight', label: 'Emagrecer', desc: 'Perder gordura com saciedade' },
                                { id: 'gain_muscle', label: 'Ganhar Massa', desc: 'Aumentar volume e força' },
                                { id: 'definition', label: 'Definição', desc: 'Manter músculos e queimar gordura' },
                                { id: 'health', label: 'Saúde & Manutenção', desc: 'Comer melhor e viver bem' },
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setPrefs({ ...prefs, goal: opt.id as Goal })}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '16px',
                                        border: prefs.goal === opt.id ? '2px solid #10B981' : '1px solid #E5E7EB',
                                        background: prefs.goal === opt.id ? '#ECFDF5' : 'white',
                                        textAlign: 'left',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#111827' }}>{opt.label}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{opt.desc}</div>
                                    </div>
                                    {prefs.goal === opt.id && <Check size={20} color="#10B981" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                            Preferências Alimentares
                        </h1>
                        <p style={{ color: '#6B7280', marginBottom: '32px' }}>
                            Como você prefere se alimentar?
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { id: 'omnivore', label: 'Como de tudo', desc: 'Carnes, ovos, vegetais e grãos' },
                                { id: 'vegetarian', label: 'Vegetariano', desc: 'Sem carnes, inclui ovos e leite' },
                                { id: 'vegan', label: 'Vegano', desc: 'Apenas alimentos de origem vegetal' },
                                { id: 'low_carb', label: 'Low Carb', desc: 'Redução de carboidratos' },
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setPrefs({ ...prefs, dietType: opt.id as DietType })}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '16px',
                                        border: prefs.dietType === opt.id ? '2px solid #10B981' : '1px solid #E5E7EB',
                                        background: prefs.dietType === opt.id ? '#ECFDF5' : 'white',
                                        textAlign: 'left', // Ensure text aligns left
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#111827' }}>{opt.label}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{opt.desc}</div>
                                    </div>
                                    {prefs.dietType === opt.id && <Check size={20} color="#10B981" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                            Tempo na Cozinha
                        </h1>
                        <p style={{ color: '#6B7280', marginBottom: '32px' }}>
                            Quanto tempo você tem para preparar refeições?
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { id: 'fast', label: 'Muito Rápido', desc: '10-15 min (Praticidade total)' },
                                { id: 'moderate', label: 'Moderado', desc: '20-30 min (Equilíbrio)' },
                                { id: 'elaborate', label: 'Elaborado', desc: '40min+ (Gosto de cozinhar)' },
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setPrefs({ ...prefs, cookingTime: opt.id as CookingTime })}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '16px',
                                        border: prefs.cookingTime === opt.id ? '2px solid #10B981' : '1px solid #E5E7EB',
                                        background: prefs.cookingTime === opt.id ? '#ECFDF5' : 'white',
                                        textAlign: 'left',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#111827' }}>{opt.label}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{opt.desc}</div>
                                    </div>
                                    {prefs.cookingTime === opt.id && <Check size={20} color="#10B981" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                            Refeições por Dia
                        </h1>
                        <p style={{ color: '#6B7280', marginBottom: '32px' }}>
                            Quantas vezes você costuma comer?
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {[3, 4, 5, 6].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setPrefs({ ...prefs, mealsPerDay: num as any })}
                                    style={{
                                        padding: '24px',
                                        borderRadius: '16px',
                                        border: prefs.mealsPerDay === num ? '2px solid #10B981' : '1px solid #E5E7EB',
                                        background: prefs.mealsPerDay === num ? '#ECFDF5' : 'white',
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: '#111827'
                                    }}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Footer Actions */}
            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <button
                    onClick={step < 4 ? next : finish}
                    disabled={
                        (step === 1 && !prefs.goal) ||
                        (step === 2 && !prefs.dietType) ||
                        (step === 3 && !prefs.cookingTime)
                    }
                    style={{
                        width: '100%',
                        background: '#10B981',
                        color: 'white',
                        padding: '16px',
                        borderRadius: '16px',
                        border: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: ((step === 1 && !prefs.goal) || (step === 2 && !prefs.dietType) || (step === 3 && !prefs.cookingTime)) ? 0.5 : 1
                    }}
                >
                    {step < 4 ? 'Próximo' : 'Gerar Meu Cardápio'}
                    {step < 4 && <ChevronRight size={20} />}
                </button>
            </div>
        </div>
    );
}
