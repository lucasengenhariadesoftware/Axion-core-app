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

            AdManager.showInterstitial().then(() => {
                alert("Treino Concluído! Parabéns!");
                setLocation('/app/workout');
            });
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

    // --- ACTIVE PLAYER MODE ---
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
            <header style={{ padding: '16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                <Button variant="ghost" onClick={() => setMode('overview')} style={{ padding: '8px' }}>
                    <ChevronLeft />
                </Button>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <h1 style={{ fontSize: '16px', fontWeight: 600 }}>{session.title}</h1>
                    <p style={{ fontSize: '10px', color: '#666' }}>
                        Exercício {activeExerciseIndex + 1} de {session.exercises.length}
                    </p>
                </div>
                <div style={{ width: '40px' }} />
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>{currentExercise.exerciseName}</h2>
                    {/* GIF Section */}
                    {libraryData?.gifUrl && !imageError[currentExercise.exerciseId] ? (
                        <div style={{ width: '100%', height: 'auto', maxHeight: '300px', overflow: 'hidden', borderRadius: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'center', background: '#f0f0f0' }}>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentExercise.sets.map((set, idx) => (
                        <Card key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#999' }}>Set {idx + 1}</span>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <span style={{ fontWeight: 600 }}>{set.reps} reps</span>
                                    {set.weight && <span style={{ color: '#666' }}>{set.weight}kg</span>}
                                </div>
                            </div>
                            <Button size="sm" onClick={() => handleSetComplete(idx)}>
                                <CheckCircle2 size={20} />
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', background: 'white' }}>
                {isResting ? (
                    <div style={{ height: '60px', background: 'var(--color-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', color: 'white' }}>
                        <span style={{ fontWeight: 600 }}>Descanso</span>
                        <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>
                            00:{timer < 10 ? `0${timer}` : timer}
                        </span>
                        <Button size="sm" variant="ghost" onClick={() => setIsResting(false)} style={{ color: 'white' }}>
                            Pular <SkipForward size={16} />
                        </Button>
                    </div>
                ) : (
                    <Button fullWidth onClick={nextExercise}>
                        {activeExerciseIndex < session.exercises.length - 1 ? 'Próximo Exercício' : 'Finalizar Treino'}
                    </Button>
                )}
            </div>
        </div >
    );
}
