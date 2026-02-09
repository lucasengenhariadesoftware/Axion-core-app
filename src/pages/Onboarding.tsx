import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/inputs/Input';
import { useUserStore } from '../store/userStore';
import { useLocation } from 'wouter';
import { UserProfile, Gender, Goal, ActivityLevel } from '../types';
import { generateDailyPlan } from '../lib/planner';
import { billingService } from '../services/BillingServiceFactory';
import { useCoachStore } from '../store/coachStore';

export default function Onboarding() {
    const { t } = useTranslation();
    const [, setLocation] = useLocation();
    const { completeOnboarding } = useUserStore();
    const [step, setStep] = useState(1);

    // Form State
    const [formData, setFormData] = useState<Partial<UserProfile>>({
        name: '',
        age: 25,
        birthDate: '', // Initialize birthDate
        height: 170,
        weight: 70,
        gender: 'male',
        activityLevel: 'moderately_active',
        goal: 'lose_weight',
        dietaryRestrictions: []
    });

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            finishOnboarding();
        }
    };

    const finishOnboarding = () => {
        if (!formData.name) {
            setStep(1); // Redirect to step 1
            // You might want to use a toast here ideally, but for now simple alert
            alert("Por favor, preencha seu nome para continuar.");
            return;
        }

        try {
            // Calculate age from birthDate if available
            let calculatedAge = formData.age || 25;
            if (formData.birthDate) {
                const birth = new Date(formData.birthDate);
                const today = new Date();
                let age = today.getFullYear() - birth.getFullYear();
                const m = today.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                    age--;
                }
                calculatedAge = age;
            }

            const finalProfile: UserProfile = {
                name: formData.name,
                gender: formData.gender || 'male',
                age: calculatedAge,
                birthDate: formData.birthDate,
                height: Number(formData.height),
                weight: Number(formData.weight),
                goal: formData.goal || 'lose_weight',
                activityLevel: formData.activityLevel || 'moderately_active',
                dietaryRestrictions: formData.dietaryRestrictions || []
            };

            // GENERATE INITIAL PLAN HERE
            const initialPlan = generateDailyPlan(finalProfile);

            completeOnboarding(finalProfile, initialPlan);
            setLocation('/app');
        } catch (error) {
            console.error("Error generating plan:", error);
            alert("Ocorreu um erro ao gerar seu plano. Tente novamente.");
        }
    };

    const handleRestore = async () => {
        try {
            const restored = await billingService.restorePurchases();
            if (restored) {
                useUserStore.getState().setPremium(true);
                useCoachStore.getState().activatePremium();
                alert("Assinatura restaurada! Você agora é PRO. Continue o cadastro para personalizar seu treino.");
            } else {
                alert("Nenhuma assinatura ativa encontrada.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao restaurar compras.");
        }
    };

    return (
        <div className="container" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: 'var(--space-8)',
            paddingBottom: 'var(--space-8)'
        }}>
            <div style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
                <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{t('app.name')}</h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} style={{
                            height: '4px',
                            width: '24px',
                            borderRadius: 'var(--radius-full)',
                            background: s <= step ? 'var(--color-accent)' : 'var(--color-surface-alt)'
                        }} />
                    ))}
                </div>
            </div>

            <Card style={{ flex: 1, maxHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
                    {step === 1 && (
                        <div>
                            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)' }}>{t('onboarding.welcome_title')}</h2>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                                {t('onboarding.welcome_subtitle')}
                            </p>
                            <Input
                                label={t('onboarding.step_name_title')}
                                placeholder={t('onboarding.step_name_placeholder')}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />

                            <h3 style={{ fontSize: 'var(--text-sm)', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Sexo Biológico</h3>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                <Button
                                    fullWidth
                                    variant={formData.gender === 'male' ? 'primary' : 'secondary'}
                                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                                >Homem</Button>
                                <Button
                                    fullWidth
                                    variant={formData.gender === 'female' ? 'primary' : 'secondary'}
                                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                                >Mulher</Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)' }}>Suas Medidas</h2>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Input
                                    label="Data de Nascimento"
                                    type="date"
                                    value={formData.birthDate || ''}
                                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                />
                                <Input
                                    label="Peso (kg)"
                                    type="number"
                                    value={formData.weight}
                                    onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                                />
                            </div>
                            <Input
                                label="Altura (cm)"
                                type="number"
                                value={formData.height}
                                onChange={e => setFormData({ ...formData, height: Number(e.target.value) })}
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Nível de Atividade</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {[
                                    { id: 'sedentary', label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
                                    { id: 'lightly_active', label: 'Levemente Ativo', desc: '1-3 dias/semana' },
                                    { id: 'moderately_active', label: 'Moderadamente Ativo', desc: '3-5 dias/semana' },
                                    { id: 'very_active', label: 'Muito Ativo', desc: '6-7 dias/semana' }
                                ].map((lvl) => (
                                    <Button
                                        key={lvl.id}
                                        variant={formData.activityLevel === lvl.id ? 'primary' : 'secondary'}
                                        style={{ justifyContent: 'flex-start', textAlign: 'left', height: 'auto', padding: '12px' }}
                                        fullWidth
                                        onClick={() => setFormData({ ...formData, activityLevel: lvl.id as ActivityLevel })}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <span>{lvl.label}</span>
                                            <span style={{ fontSize: 'var(--text-xs)', opacity: 0.8, fontWeight: 400 }}>{lvl.desc}</span>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Seu Objetivo Principal</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                                {formData.gender === 'female' ? (
                                    <>
                                        {[
                                            { id: 'definition', label: 'Definição e Tonificação', desc: 'Definir sem volume excessivo' },
                                            { id: 'glute_growth', label: 'Crescimento de Glúteos', desc: 'Foco em glúteos e pernas' },
                                            { id: 'lose_weight', label: 'Emagrecimento', desc: 'Queimar gordura corporal' },
                                            { id: 'health_female', label: 'Saúde Feminina', desc: 'Core, postura e bem-estar' },
                                            { id: 'force_female', label: 'Força Funcional', desc: 'Fortalecimento geral seguro' },
                                            { id: 'post_partum', label: 'Pós-Parto (Recuperação)', desc: 'Retorno gradual e seguro' }
                                        ].map((g) => (
                                            <Button
                                                key={g.id}
                                                variant={formData.goal === g.id ? 'primary' : 'secondary'}
                                                fullWidth
                                                style={{ padding: '12px', justifyContent: 'flex-start', textAlign: 'left', height: 'auto' }}
                                                onClick={() => setFormData({ ...formData, goal: g.id as Goal })}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <span style={{ fontWeight: 600 }}>{g.label}</span>
                                                    <span style={{ fontSize: '12px', opacity: 0.8, fontWeight: 400 }}>{g.desc}</span>
                                                </div>
                                            </Button>
                                        ))}
                                    </>
                                ) : (
                                    [
                                        { id: 'gain_muscle', label: 'Hipertrofia Avançada', desc: 'Foco máximo em volume muscular' },
                                        { id: 'force_max', label: 'Força Máxima', desc: 'Aumentar cargas em exercícios base' },
                                        { id: 'lose_weight', label: 'Queimar Gordura', desc: 'Reduzir percentual de gordura' },
                                        { id: 'definition', label: 'Definição Muscular', desc: 'Manter massa, perder gordura' },
                                        { id: 'athletic', label: 'Performance Atlética', desc: 'Potência e condicionamento esportivo' },
                                        { id: 'longevity', label: 'Longevidade Ativa', desc: 'Saúde, mobilidade e funcionalidade' }
                                    ].map((g) => (
                                        <Button
                                            key={g.id}
                                            variant={formData.goal === g.id ? 'primary' : 'secondary'}
                                            fullWidth
                                            style={{ padding: '12px', justifyContent: 'flex-start', textAlign: 'left', height: 'auto' }}
                                            onClick={() => setFormData({ ...formData, goal: g.id as Goal })}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                <span style={{ fontWeight: 600 }}>{g.label}</span>
                                                <span style={{ fontSize: '12px', opacity: 0.8, fontWeight: 400 }}>{g.desc}</span>
                                            </div>
                                        </Button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-6)' }}>
                    <Button fullWidth onClick={handleNext}>
                        {step === 4 ? t('onboarding.start_btn') : t('onboarding.next_btn')}
                    </Button>
                </div>

                {step === 1 && (
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <button
                            onClick={handleRestore}
                            style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', textDecoration: 'underline', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
                        >
                            Já tem uma assinatura? Restaurar Compras
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
}
