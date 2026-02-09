import { useEffect, useState } from 'react';
import { Utensils, ShoppingBag } from 'lucide-react';
import { useDietStore } from '../../store/dietStore';
import { useUserStore } from '../../store/userStore';
import DietOnboarding from '../../components/diet/DietOnboarding';
import DietHeader from '../../components/diet/DietHeader';
import DietCoach from '../../components/diet/DietCoach';
import FridgeMode from '../../components/diet/FridgeMode';
import MealCard from '../../components/diet/MealCard';
import ShoppingList from '../../components/diet/ShoppingList';

export default function DietTab() {
    const { preferences, generatePlan } = useDietStore();
    const { dailyPlan: currentPlan } = useUserStore();
    const [view, setView] = useState<'meals' | 'shopping'>('meals');
    const [showFridgeMode, setShowFridgeMode] = useState(false);

    useEffect(() => {
        if (preferences && !currentPlan) {
            generatePlan();
        }
    }, [preferences, currentPlan, generatePlan]);

    // 1. Onboarding Flow
    if (!preferences) {
        return <DietOnboarding />;
    }

    // 2. Loading State (should be fast)
    if (!currentPlan) {
        return (
            <div style={{
                height: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', color: '#6B7280'
            }}>
                <div className="animate-spin" style={{
                    width: '32px', height: '32px', borderRadius: '50%', border: '4px solid #E5E7EB',
                    borderTopColor: '#10B981', marginBottom: '16px'
                }} />
                <p>Gerando seu cardápio ideal...</p>
            </div>
        );
    }

    // 3. Main Dashboard
    return (
        <div className="container" style={{ padding: '0', background: '#F9FAFB', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 100px 24px' }}>
                <DietHeader />
                <DietCoach />

                {/* View/Tab Switcher */}
                <div style={{
                    background: 'white', padding: '4px', borderRadius: '16px',
                    display: 'flex', marginBottom: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                    <button
                        onClick={() => setView('meals')}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '12px', border: 'none',
                            background: view === 'meals' ? '#10B981' : 'transparent',
                            color: view === 'meals' ? 'white' : '#6B7280',
                            fontWeight: 600, fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: 'all 0.2s ease', cursor: 'pointer'
                        }}
                    >
                        <Utensils size={18} />
                        Refeições
                    </button>
                    <button
                        onClick={() => setView('shopping')}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '12px', border: 'none',
                            background: view === 'shopping' ? '#10B981' : 'transparent',
                            color: view === 'shopping' ? 'white' : '#6B7280',
                            fontWeight: 600, fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: 'all 0.2s ease', cursor: 'pointer'
                        }}
                    >
                        <ShoppingBag size={18} />
                        Lista
                    </button>
                </div>

                {/* Content Area */}
                {view === 'meals' ? (
                    <div className="animate-fade-in">
                        {currentPlan.meals.map(meal => (
                            <MealCard key={meal.id} meal={meal} />
                        ))}

                        <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '32px' }}>
                            <button
                                onClick={() => setShowFridgeMode(true)}
                                style={{
                                    background: '#F3F4F6', border: 'none', borderRadius: '12px',
                                    color: '#4B5563', padding: '12px 24px', fontSize: '0.9rem', fontWeight: 600,
                                    display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>🧊</span> Modo Geladeira
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <ShoppingList />
                    </div>
                )}
            </div>

            {/* Modals */}
            {showFridgeMode && <FridgeMode onClose={() => setShowFridgeMode(false)} />}
        </div>
    );
}
