import { ArrowRight, Clock, Flame } from 'lucide-react';
import { useDietStore } from '../../store/dietStore';

export default function DietHeader() {
    const { currentPlan } = useDietStore();

    if (!currentPlan) return null;

    // Logic to find next meal
    const nextMeal = currentPlan.meals.find(m => !m.done) || currentPlan.meals[currentPlan.meals.length - 1]; // Fallback para a última

    const isNearWorkout = nextMeal.type === 'pre_workout' || nextMeal.type === 'post_workout';
    const title = isNearWorkout ? 'Pré-treino recomendado' : 'Próxima refeição';

    const scrollToMeal = (id: string) => {
        const element = document.getElementById(`meal-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight effect
            element.style.transition = 'transform 0.3s ease';
            element.style.transform = 'scale(1.02)';
            setTimeout(() => element.style.transform = 'scale(1)', 500);
        }
    };

    return (
        <div style={{ marginBottom: '24px' }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '0.9rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h2>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '4px 0' }}>
                        Hoje
                    </h1>
                    <div style={{
                        display: 'inline-block',
                        background: '#ECFDF5',
                        color: '#10B981',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 700
                    }}>
                        {currentPlan.meta.focus}
                    </div>
                </div>
            </div>

            {/* Smart Next Meal Card */}
            <div style={{
                background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
                borderRadius: '24px',
                padding: '24px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
            }}>
                {/* Content */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '8px',
                            fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            {isNearWorkout && <Flame size={12} fill="#FCD34D" color="#FCD34D" />}
                            {title}
                        </div>
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.2 }}>
                        {nextMeal.name}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', opacity: 0.9 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={16} />
                            <span style={{ fontWeight: 500 }}>{nextMeal.time}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 500 }}>~{nextMeal.items.reduce((acc, i) => acc + (i.calories || 0), 0) || 450} kcal</span>
                        </div>
                    </div>

                    <button
                        onClick={() => scrollToMeal(nextMeal.id)}
                        style={{
                            background: 'white',
                            color: '#111827',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '16px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        Começar agora
                        <ArrowRight size={20} />
                    </button>
                </div>

                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute', top: -20, right: -20, width: '200px', height: '200px',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(40px)'
                }} />
                <div style={{
                    position: 'absolute', bottom: -40, left: -20, width: '150px', height: '150px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(30px)'
                }} />
            </div>
        </div>
    );
}
