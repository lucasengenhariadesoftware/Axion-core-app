import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { generateDailyPlan, DailyPlan } from '../lib/planner';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Trophy, Droplets, Utensils, Dumbbell, CheckCircle2, Circle, Flame } from 'lucide-react';
import { NotesAccordion } from '../components/today/NotesAccordion';

export default function Dashboard() {
    const { profile } = useUserStore();
    const [plan, setPlan] = useState<DailyPlan | null>(null);
    const [waterIntake, setWaterIntake] = useState(0);

    useEffect(() => {
        if (profile) {
            setPlan(generateDailyPlan(profile));
        }
    }, [profile]);

    if (!plan) return null;

    const toggleMeal = (id: string) => {
        if (!plan) return;
        setPlan({
            ...plan,
            meals: plan.meals.map(m => m.id === id ? { ...m, completed: !(m as any).completed } : m)
        });
    };

    const toggleWorkout = () => {
        if (!plan || !plan.workout) return;
        setPlan({
            ...plan,
            workout: { ...plan.workout, completed: !plan.workout.completed }
        });
    };

    const addWater = (amount: number) => {
        setWaterIntake(prev => Math.min(prev + amount, (plan as any).waterTarget + 1000));
    };

    const completedMeals = plan.meals.filter(m => (m as any).completed).length;
    const totalMeals = plan.meals.length;
    const progress = Math.round(((completedMeals + ((plan.workout as any)?.completed ? 1 : 0)) / (totalMeals + 1)) * 100);

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            {/* Header */}
            <header style={{ paddingTop: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
                            Hoje
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    <div style={{
                        background: 'var(--color-surface-alt)',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <Flame size={16} fill="orange" color="orange" />
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>3 Dias</span>
                    </div>
                </div>
            </header>

            {/* Progress Card */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ background: 'var(--color-primary)', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: 'var(--text-sm)', opacity: 0.9 }}>Progresso Diário</span>
                        <span style={{ fontWeight: 700 }}>{progress}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'var(--color-accent)',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </Card>
            </div>

            {/* Main Actions */}
            <section style={{ marginBottom: 'var(--space-8)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Sua Rotina</h2>

                {/* Workout */}
                {plan.workout && (
                    <Card
                        onClick={toggleWorkout}
                        style={{
                            marginBottom: 'var(--space-3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-4)',
                            cursor: 'pointer',
                            border: (plan.workout as any).completed ? '1px solid var(--color-success)' : '1px solid transparent',
                            transition: 'var(--transition-fast)'
                        }}
                    >
                        <div style={{
                            background: (plan.workout as any).completed ? 'var(--color-success)' : 'var(--color-surface)',
                            padding: '10px',
                            borderRadius: 'var(--radius-full)',
                            color: (plan.workout as any).completed ? 'white' : 'var(--color-primary)'
                        }}>
                            <Dumbbell size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontWeight: 600, textDecoration: (plan.workout as any).completed ? 'line-through' : 'none' }}>
                                {(plan.workout as any).title}
                            </h3>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                                {(plan.workout as any).duration} min • {(plan.workout as any).exercisesCount || 0} exercícios
                            </p>
                        </div>
                        {(plan.workout as any).completed ?
                            <CheckCircle2 color="var(--color-success)" fill="var(--color-success)" fillOpacity={0.2} /> :
                            <Circle color="#ddd" />
                        }
                    </Card>
                )}

                {/* Meals */}
                {plan.meals.map((meal) => (
                    <Card
                        key={meal.id}
                        onClick={() => toggleMeal(meal.id)}
                        style={{
                            marginBottom: 'var(--space-3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-4)',
                            cursor: 'pointer',
                            opacity: (meal as any).completed ? 0.6 : 1
                        }}
                    >
                        <div style={{
                            background: (meal as any).completed ? 'var(--color-success)' : 'var(--color-surface)',
                            padding: '10px',
                            borderRadius: 'var(--radius-full)',
                            color: (meal as any).completed ? 'white' : 'var(--color-accent-dark)'
                        }}>
                            <Utensils size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-dark)', fontWeight: 600, textTransform: 'uppercase' }}>
                                    {meal.type}
                                </p>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                                    ~{meal.calories} kcal
                                </p>
                            </div>
                            <h3 style={{ fontWeight: 600, fontSize: 'var(--text-sm)', textDecoration: (meal as any).completed ? 'line-through' : 'none' }}>
                                {(meal as any).title}
                            </h3>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                                {meal.description}
                            </p>
                        </div>
                        {(meal as any).completed ?
                            <CheckCircle2 color="var(--color-success)" fill="var(--color-success)" fillOpacity={0.2} /> :
                            <Circle color="#ddd" />
                        }
                    </Card>
                ))}
            </section>

            {/* Water Tracker */}
            <section>
                <Card style={{ background: '#E0F2FE', color: '#0369A1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Droplets size={20} fill="#0EA5E9" stroke="none" />
                            <h3 style={{ fontWeight: 600 }}>Hidratação</h3>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>
                            {waterIntake} <span style={{ fontSize: 'var(--text-sm)', opacity: 0.7 }}>/ {(plan as any).waterTarget || 2500}ml</span>
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            size="sm"
                            onClick={() => addWater(250)}
                            style={{ background: '#fff', color: '#0284C7', border: 'none', boxShadow: 'var(--shadow-sm)' }}
                        >
                            +250ml
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => addWater(500)}
                            style={{ background: '#fff', color: '#0284C7', border: 'none', boxShadow: 'var(--shadow-sm)' }}
                        >
                            +500ml
                        </Button>
                    </div>
                </Card>
            </section>

            {/* Notes Accordion */}
            <section>
                <NotesAccordion />
            </section>
        </div>
    );
}
