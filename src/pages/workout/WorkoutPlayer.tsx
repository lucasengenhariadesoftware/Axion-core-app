import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useUserStore } from '../../store/userStore';
import { AdManager } from '../../services/AdManager';
import { WorkoutSession } from '../../types/workout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ChevronLeft, CheckCircle2, Clock, SkipForward, List } from 'lucide-react';
import { EXERCISE_LIBRARY } from '../../data/exercises';

export default function WorkoutPlayer() {
    const [, params] = useRoute('/app/workout/session/:sessionId');
    const [, setLocation] = useLocation();
    const { profile, weeklyPlan, toggleWorkout } = useUserStore();
    const [session, setSession] = useState<WorkoutSession | null>(null);

    // Modes: 'overview' | 'active'
    const [mode, setMode] = useState<'overview' | 'active'>('overview');
    const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [timer, setTimer] = useState(0);
    const [imageError, setImageError] = useState<Record<string, boolean>>({});
    const [workoutTime, setWorkoutTime] = useState(0);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const sessionId = params ? (params as any).sessionId : null;
        if (weeklyPlan && sessionId) {
            const foundSession = weeklyPlan.sessions.find(s => s.id === sessionId);
            if (foundSession) {
                setSession(foundSession);
            } else {
                // If session not found (e.g. old link), maybe go back or show error
                console.error("Session not found in current plan");
                setLocation('/app/workout');
            }
        } else if (!weeklyPlan && profile) {
            // Plan missing? Redirect to main tab to generate
            setLocation('/app/workout');
        }
    }, [weeklyPlan, params, profile, setLocation]);

    useEffect(() => {
        let interval: any;
        if (isResting && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0 && isResting) {
            setIsResting(false);
        }
        return () => clearInterval(interval);
    }, [isResting, timer]);

    // Global workout timer
    useEffect(() => {
        let interval: any;
        if (mode === 'active') {
            interval = setInterval(() => setWorkoutTime(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [mode]);

    if (!session) return <div className="container">Carregando treino...</div>;

    const currentExercise = session.exercises[activeExerciseIndex];
    const libraryData = EXERCISE_LIBRARY[currentExercise.exerciseId];

    const handleSetComplete = (setIndex: number) => {
        startRest(currentExercise.sets[setIndex].restSeconds);
    };

    const startRest = (seconds: number) => {
        setTimer(seconds);
        setIsResting(true);
    };

    const nextExercise = () => {
        if (activeExerciseIndex < session.exercises.length - 1) {
            setActiveExerciseIndex(prev => prev + 1);
            setIsResting(false);
        } else {
            // Mark as completed in Store/AI Context
            toggleWorkout();

            // AdManager.showInterstitial(true).then(() => {
                alert("Treino Concluído! Parabéns!");
                setLocation('/app/workout');
            // });
        }
    };

    // --- OVERVIEW MODE ---
    if (mode === 'overview') {
        return (
            <div className="container" style={{ paddingBottom: '100px', paddingTop: '20px' }}>
                <header style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Button variant="ghost" onClick={() => setLocation('/app/workout')} style={{ padding: '0' }}>
                        <ChevronLeft />
                    </Button>
                    <h1 style={{ fontSize: '24px', fontWeight: 700 }}>{session.title}</h1>
                </header>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', color: '#666', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={16} /> <span>{session.estimatedDuration} min</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <List size={16} /> <span>{session.exercises.length} Exercícios</span>
                    </div>
                </div>

                <section>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Lista de Exercícios</h2>
                    {session.exercises.map((ex, idx) => {
                        const lib = EXERCISE_LIBRARY[ex.exerciseId];
                        return (
                            <Card
                                key={idx}
                                onClick={() => {
                                    setMode('active');
                                    setActiveExerciseIndex(idx);
                                }}
                                style={{ marginBottom: '12px', padding: '16px', cursor: 'pointer', transition: 'transform 0.1s' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#999', textTransform: 'uppercase' }}>
                                            {lib?.muscleGroup || 'Geral'}
                                        </span>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{ex.exerciseName}</h3>
                                        <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                            {ex.sets.length} séries x {ex.sets[0].reps} reps
                                        </p>
                                    </div>
                                    {/* Thumbnail removed as requested */}
                                </div>
                            </Card>
                        );
                    })}
                </section>
            </div>
        );
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(180deg, var(--color-surface) 0%, #F8FAFC 100%)', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
            <header style={{ 
                padding: '20px 16px', 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                position: 'relative',
                zIndex: 10
            }}>
                <Button variant="ghost" onClick={() => setMode('overview')} style={{ padding: '8px', background: 'var(--color-surface-alt)', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <ChevronLeft size={20} />
                </Button>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.3px' }}>{session.title}</h1>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500, marginTop: '2px' }}>
                        Exercício {activeExerciseIndex + 1} de {session.exercises.length}
                    </p>
                </div>
                <div style={{ width: 'auto', minWidth: '40px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)' }}>
                    <Clock size={16} />
                    <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>
                        {formatTime(workoutTime)}
                    </span>
                </div>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', paddingBottom: '40px' }}>
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '20px', color: 'var(--color-primary)', letterSpacing: '-0.5px' }}>{currentExercise.exerciseName}</h2>
                    {/* GIF Section */}
                    {libraryData?.gifUrl && !imageError[currentExercise.exerciseId] ? (
                        <div style={{ 
                            width: '100%', 
                            height: 'auto', 
                            maxHeight: '320px', 
                            overflow: 'hidden', 
                            borderRadius: '24px', 
                            marginBottom: '24px', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            background: '#f8fafc',
                            boxShadow: 'var(--shadow-md)',
                            border: '1px solid rgba(0,0,0,0.03)'
                        }}>
                            <img
                                src={libraryData.gifUrl}
                                alt={currentExercise.exerciseName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={() => setImageError(prev => ({ ...prev, [currentExercise.exerciseId]: true }))}
                            />
                        </div>
                    ) : (
                        <div style={{
                            width: '100%',
                            minHeight: '260px',
                            background: 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)',
                            borderRadius: '16px',
                            marginBottom: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '24px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{
                                    background: 'var(--color-primary)',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    marginRight: '12px',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <List size={20} color="white" />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B', letterSpacing: '-0.02em', margin: 0 }}>
                                    Como Executar
                                </h3>
                            </div>

                            {libraryData?.instructions ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {libraryData.instructions.map((step, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            <div style={{
                                                minWidth: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: '#DBEAFE',
                                                color: '#2563EB',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: '2px'
                                            }}>
                                                {i + 1}
                                            </div>
                                            <p style={{
                                                margin: 0,
                                                color: '#334155',
                                                fontSize: '15px',
                                                lineHeight: '1.6',
                                                fontWeight: 500,
                                                textAlign: 'left'
                                            }}>
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                                    Descrição detalhada indisponível.
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {libraryData?.tips.slice(0, 2).map((tip, i) => (
                            <span key={i} style={{ fontSize: '12px', background: '#FDE68A', color: '#92400E', padding: '4px 8px', borderRadius: '4px' }}>
                                💡 {tip}
                            </span>
                        ))}
                    </div>

                    {/* Instructions below GIF if GIF exists */}
                    {libraryData?.gifUrl && !imageError[currentExercise.exerciseId] && libraryData?.instructions && (
                        <div style={{ marginTop: '24px', textAlign: 'left' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ background: '#F1F5F9', padding: '6px', borderRadius: '6px' }}>
                                    <List size={16} className="text-slate-600" />
                                </div>
                                Passo a Passo
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {libraryData.instructions.map((step, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <span style={{
                                            color: '#94A3B8',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            marginTop: '4px',
                                            minWidth: '16px'
                                        }}>
                                            0{i + 1}
                                        </span>
                                        <p style={{
                                            margin: 0,
                                            color: '#475569',
                                            fontSize: '14px',
                                            lineHeight: '1.6',
                                            fontWeight: 500
                                        }}>
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {currentExercise.sets.map((set, idx) => (
                        <Card key={idx} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            padding: '16px 20px',
                            background: 'var(--color-surface-alt)',
                            border: '1px solid rgba(0,0,0,0.03)',
                            borderRadius: '16px',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Set {idx + 1}</span>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)' }}>{set.reps}</span>
                                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>reps</span>
                                    {set.weight && <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)', marginLeft: '8px' }}>• {set.weight}kg</span>}
                                </div>
                            </div>
                            <Button size="sm" onClick={() => handleSetComplete(idx)} style={{ 
                                background: 'white',
                                color: 'var(--color-accent)', 
                                border: '2px solid var(--color-accent)',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                padding: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}>
                                <CheckCircle2 size={24} />
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>

            <div style={{ 
                padding: '16px 20px 100px 20px', 
                background: 'rgba(248, 250, 252, 0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 -4px 24px rgba(0,0,0,0.03)',
                zIndex: 20
            }}>
                {isResting ? (
                    <div style={{ 
                        height: '56px', 
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)', 
                        borderRadius: '16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '0 20px', 
                        color: 'white',
                        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.15)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={18} className="animate-pulse" />
                            <span style={{ fontWeight: 600, fontSize: '14px' }}>Descanso</span>
                        </div>
                        <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '1px' }}>
                            00:{timer < 10 ? `0${timer}` : timer}
                        </span>
                        <Button size="sm" variant="ghost" onClick={() => setIsResting(false)} style={{ color: 'white', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '36px', padding: '0 12px' }}>
                            Pular <SkipForward size={14} style={{ marginLeft: '4px' }} />
                        </Button>
                    </div>
                ) : (
                    <Button fullWidth onClick={nextExercise} style={{ 
                        height: '54px', 
                        fontSize: '16px', 
                        fontWeight: 700,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
                        color: 'white',
                        boxShadow: '0 6px 16px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        {activeExerciseIndex < session.exercises.length - 1 ? 'Próximo Exercício' : 'Finalizar Treino'}
                    </Button>
                )}
            </div>
        </div >
    );
}
