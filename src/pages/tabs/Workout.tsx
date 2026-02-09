
import { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { generateWeeklyPlan } from '../../lib/workout_logic';
import { WorkoutSession } from '../../types/workout';
import { Clock, RefreshCw, Dumbbell, Flame, Heart, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';
import './Workout.css';

export default function WorkoutTab() {
    const { profile, weeklyPlan, setWeeklyPlan } = useUserStore();
    const [, setLocation] = useLocation();
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        if (profile && !weeklyPlan) {
            const plan = generateWeeklyPlan(profile);
            setWeeklyPlan(plan);
        }
    }, [profile, weeklyPlan, setWeeklyPlan]);

    const handleRegenerate = () => {
        if (!profile) return;
        setIsGenerating(true);
        // Simulate "AI" processing time for UX
        setTimeout(() => {
            const newPlan = generateWeeklyPlan(profile);
            setWeeklyPlan(newPlan);
            setIsGenerating(false);
        }, 800);
    };

    if (!weeklyPlan) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Criando seu plano...</p>
        </div>
    );

    const getGoalIcon = () => {
        if (weeklyPlan.goal.includes('Gordura')) return <Flame className="text-orange-500" size={20} />;
        if (weeklyPlan.goal.includes('Hipertrofia')) return <Dumbbell className="text-blue-500" size={20} />;
        return <Heart className="text-emerald-500" size={20} />;
    };

    const getGoalLabel = () => {
        if (weeklyPlan.goal.includes('Gordura')) return 'Queima de Gordura';
        if (weeklyPlan.goal.includes('Hipertrofia')) return 'Hipertrofia';
        return 'Saúde & Cardio';
    };

    return (
        <div className="container workout-tab-container">
            {/* Header Section */}
            <header className="workout-header">
                <div className="header-row">
                    <div className="text-content">


                        <div className="minimal-badge">
                            {getGoalIcon()}
                            {getGoalLabel()}
                        </div>

                        <h1 className="minimal-title">
                            {weeklyPlan.name}
                        </h1>

                        <div className="minimal-meta">
                            <span>
                                {weeklyPlan.level === 'beginner' ? 'Nível Iniciante' : weeklyPlan.level === 'intermediate' ? 'Nível Intermediário' : 'Nível Avançado'}
                            </span>
                            <div className="meta-separator"></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CalendarIcon size={14} />
                                <span>{weeklyPlan.sessions.length} sessões/sem</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleRegenerate}
                        disabled={isGenerating}
                        className="btn-magic"
                        aria-label="Regenerar plano"
                    >
                        {isGenerating ? (
                            <RefreshCw size={16} className="animate-spin" />
                        ) : (
                            <>
                                <Sparkles size={16} />
                                <span>AI Remodular</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Calendar Strip */}
            <div className="calendar-section">
                <div className="section-header">
                    <h3 className="section-title">Esta Semana</h3>
                    <span className="section-subtitle">Janeiro 2026</span>
                </div>

                <div className="calendar-strip">
                    {Array.from({ length: 7 }).map((_, i) => {
                        const today = new Date();
                        const currentDay = today.getDay(); // 0 (Sun) - 6 (Sat)
                        // Adjust to start from Sunday or keep current logic
                        const startOfWeek = new Date(today);
                        startOfWeek.setDate(today.getDate() - currentDay);

                        const date = new Date(startOfWeek);
                        date.setDate(startOfWeek.getDate() + i);

                        const isToday = i === currentDay;
                        const isSelected = selectedDate.getDate() === date.getDate();
                        const dayLabel = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'][i];

                        return (
                            <button
                                key={i}
                                onClick={() => setSelectedDate(date)}
                                className={`day-btn ${isSelected ? 'active' : 'inactive'}`}
                            >
                                <span className="day-label">{dayLabel}</span>
                                <span className="day-number">{date.getDate()}</span>
                                {isToday && !isSelected && (
                                    <div className="active-dot"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Workouts List */}
            <section className="workouts-section">
                <div className="section-header" style={{ marginBottom: '16px' }}>
                    <h3 className="section-title">Seus Treinos</h3>
                </div>

                <div className="workouts-list">
                    {weeklyPlan.sessions.map((session) => (
                        <WorkoutSessionCard
                            key={session.id}
                            session={session}
                            onStart={() => setLocation(`/app/workout/session/${session.id}`)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}



const WorkoutSessionCard = ({ session, onStart }: { session: WorkoutSession, onStart: () => void }) => {
    return (
        <div
            onClick={onStart}
            className="workout-card"
        >
            <div className="workout-card-deco"></div>

            <div className="card-content-wrapper">
                {/* Header tag */}
                <div className="card-header">
                    <span className="day-badge">
                        {session.dayLabel}
                    </span>
                    <span className="duration-badge">
                        <Clock size={12} />
                        {session.estimatedDuration} min
                    </span>
                </div>

                {/* Content */}
                <div className="card-title-section">
                    <h3 className="workout-title">
                        {session.title}
                    </h3>
                    <p className="workout-focus">
                        {session.focus}
                    </p>
                </div>

                {/* Exercises Preview */}
                <div className="exercises-preview">
                    {session.exercises.slice(0, 3).map((ex, i) => (
                        <div key={i} className="exercise-chip">
                            {ex.exerciseName}
                        </div>
                    ))}
                    {session.exercises.length > 3 && (
                        <div className="more-chip">
                            +{session.exercises.length - 3}
                        </div>
                    )}
                </div>

                {/* Action Footer */}
                <div className="card-footer">
                    <span className="exercise-count">
                        {session.exercises.length} exercícios
                    </span>

                    <button className="btn-start">
                        INICIAR TREINO
                        <div className="icon-circle-small">
                            <ChevronRight size={14} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
