import { useMemo } from 'react';
import {
    Brain, Utensils, Dumbbell, Footprints, Droplets
} from 'lucide-react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, BarChart, Bar, XAxis, Cell
} from 'recharts';
import { useUserStore } from '../../store/userStore';
import { useRunStore } from '../../store/runStore';
import { useDietStore } from '../../store/dietStore';

export const AxionReportTemplate = () => {
    const { profile, history, waterIntake, dailyPlan: userPlan } = useUserStore();
    const { currentPlan: dietPlan } = useDietStore();

    // --- DATA INTELLIGENCE ---
    const dailyStats = useMemo(() => {
        const runState = useRunStore.getState();
        const currentWater = waterIntake || 0;

        // Targets & Actuals Calculation (Synced with CaloriesCard.tsx) -> FROM DIET STORE
        let totalCalories = 0;
        let consumedCalories = 0;
        let totalProtein = 0;
        let consumedProtein = 0;

        if (dietPlan) {
            dietPlan.meals.forEach(meal => {
                const mealCalories = meal.items?.reduce((acc, item) => acc + item.calories, 0) || meal.calories || 0;
                const mealProtein = meal.items?.reduce((acc, item) => acc + item.macros.protein, 0) || 0;

                totalCalories += mealCalories;
                totalProtein += mealProtein;

                if (meal.done) {
                    consumedCalories += mealCalories;
                    consumedProtein += mealProtein;
                }
            });
        }

        // Fallback targets if plan is empty
        const targetCalories = totalCalories > 0 ? totalCalories : (dietPlan?.meta?.totalCalories || 2000);
        const targetProtein = totalProtein > 0 ? totalProtein : (dietPlan?.meta?.protein || 150);
        const targetWater = dietPlan?.meta?.waterTarget || 3000;

        // Workout Data -> FROM USER STORE (Source of Truth for Workouts)
        const workoutCompleted = userPlan?.workout?.completed || false;
        const workoutDuration = workoutCompleted ? (userPlan?.workout?.estimatedDuration || 0) : 0;

        // Run Data
        const todayStr = new Date().toDateString();
        const todayRun = runState.history.find(r => new Date(r.startTime).toDateString() === todayStr);
        const runCompleted = !!todayRun;
        const runDistance = todayRun ? (todayRun.distance / 1000) : 0;

        // Productivity / Foco -> Calculated as Average of the 5 Graph Markers
        // User Request: "aumente ou diminua o 'foco' de acordo com os marcadores do grafico"
        const calcCalPct = targetCalories > 0 ? Math.min(100, (consumedCalories / targetCalories) * 100) : 0;
        const calcProtPct = targetProtein > 0 ? Math.min(100, (consumedProtein / targetProtein) * 100) : 0;
        const calcWaterPct = targetWater > 0 ? Math.min(100, (currentWater / targetWater) * 100) : 0;
        const calcWorkoutPct = workoutCompleted ? 100 : 0;
        const calcRunPct = runCompleted ? 100 : 0;

        const productivityScore = (calcCalPct + calcProtPct + calcWaterPct + calcWorkoutPct + calcRunPct) / 5;

        return {
            calories: { current: consumedCalories, target: targetCalories, pct: targetCalories > 0 ? (consumedCalories / targetCalories) * 100 : 0 },
            protein: { current: consumedProtein, target: targetProtein, pct: targetProtein > 0 ? (consumedProtein / targetProtein) * 100 : 0 },
            water: { current: currentWater, target: targetWater, pct: (currentWater / targetWater) * 100 },
            workout: { completed: workoutCompleted, duration: workoutDuration },
            run: { completed: runCompleted, distance: runDistance },
            productivity: productivityScore,
            date: new Date()
        };
    }, [profile, history, dietPlan, userPlan, waterIntake]);

    // --- AI COACH ANALYSIS ---
    // We prefer raw data objects for the improved UI instead of a single string
    const reportData = useMemo(() => {
        const { calories, protein, water, workout, run } = dailyStats;

        return [
            {
                label: "Nutrição",
                value: `${Math.round(calories.current)} kcal`,
                sub: `${Math.round(protein.current)}g Proteína`,
                status: calories.pct >= 90 ? 'good' : 'neutral',
                icon: Utensils,
                color: '#f59e0b' // Amber
            },
            {
                label: "Musculação",
                value: workout.completed ? "Concluído" : "Pendente",
                sub: workout.completed ? `${workout.duration} min` : "Sem registro",
                status: workout.completed ? 'good' : 'warning',
                icon: Dumbbell,
                color: '#3b82f6' // Blue
            },
            {
                label: "Cardio / Run",
                value: run.completed ? "Concluído" : "Off",
                sub: run.completed ? `${run.distance.toFixed(2)} km` : "Sem corrida",
                status: run.completed ? 'good' : 'neutral',
                icon: Footprints,
                color: '#10b981' // Emerald
            },
            {
                label: "Hidratação",
                value: `${Math.round(water.current)} ml`,
                sub: `Meta: ${water.target} ml`,
                status: water.pct >= 90 ? 'good' : 'warning',
                icon: Droplets,
                color: '#06b6d4' // Cyan
            }
        ];
    }, [dailyStats]);

    // --- RADAR CHART CONFIG ---
    const radarData = [
        { subject: 'Calorias', A: Math.min(100, dailyStats.calories.pct), fullMark: 100 },
        { subject: 'Proteína', A: Math.min(100, dailyStats.protein.pct), fullMark: 100 },
        { subject: 'Água', A: Math.min(100, dailyStats.water.pct), fullMark: 100 },
        { subject: 'Treino', A: dailyStats.workout.completed ? 100 : 20, fullMark: 100 },
        { subject: 'Corrida', A: dailyStats.run.completed ? 100 : 20, fullMark: 100 },
        { subject: 'Foco', A: dailyStats.productivity, fullMark: 100 },
    ];

    const todayDateLabel = dailyStats.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

    // History for Bar Chart
    const historyData = useMemo(() => {
        const pastHistory = history || [];
        const data = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toDateString();

            let dayData = { name: d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 1), completed: false };

            if (dateStr === today.toDateString()) {
                dayData.completed = dailyStats.workout.completed || dailyStats.run.completed;
            } else {
                const h = pastHistory.find(item => new Date(item.date).toDateString() === dateStr);
                dayData.completed = h?.workoutCompleted || false;
            }
            data.push(dayData);
        }
        return data;
    }, [history, dailyStats.workout.completed, dailyStats.run.completed]);


    return (
        <div id="axion-report" style={{
            background: '#0f172a',
            width: '100%',
            maxWidth: '100%',
            height: '1080px', // Slightly less than A4 (1123px) to prevent 2nd page due to margins
            padding: '48px',
            fontFamily: "'Outfit', 'Inter', sans-serif",
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box'
        }}>
            {/* Background Aesthetics */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(15,23,42,0) 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, rgba(15,23,42,0) 70%)', pointerEvents: 'none' }} />

            {/* HEADER */}
            <header style={{ marginBottom: '40px', position: 'relative' }}>

                {/* Brand & Date Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59,130,246,0.25)' }}>
                            <Brain size={16} color="white" />
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif' }}>AXION</span>
                    </div>
                    {/* Date - purely text now */}
                    <div>
                        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.02em' }}>{todayDateLabel}</span>
                    </div>
                </div>

                {/* Main Hero & Athlete */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.15em' }}>RELATÓRIO DIÁRIO</span>
                        </div>
                        <h1 style={{ fontSize: '42px', fontWeight: 800, margin: 0, lineHeight: '1', letterSpacing: '-0.03em', color: 'white' }}>
                            Performance<br />
                            <span style={{ color: '#94a3b8' }}>Diária</span>
                        </h1>
                    </div>

                    {/* Athlete Badge - text only, right aligned */}
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', fontWeight: 700 }}>Atleta</div>
                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#f8fafc' }}>{profile?.name || 'Visitante'}</div>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '30px' }}>

                {/* LEFT COLUMN: PRECISE SUMMARY */}
                <div>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#94a3b8', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Brain size={16} /> Resumo Preciso
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {reportData.map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'rgba(30,41,59,0.4)',
                                border: '1px solid rgba(255,255,255,0.03)',
                                borderRadius: '16px',
                                padding: '20px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '40px', height: '40px',
                                        borderRadius: '12px',
                                        background: `${item.color}15`,
                                        border: `1px solid ${item.color}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <item.icon size={20} color={item.color} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</span>
                                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>{item.value}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: '12px',
                                        color: item.status === 'good' ? '#10b981' : '#cbd5e1',
                                        fontWeight: 500,
                                        display: 'block'
                                    }}>
                                        {item.sub}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Simple Footer/Insight for Left Col */}
                    <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#93c5fd', lineHeight: '1.5' }}>
                            <strong>Análise Rápida:</strong> Mantenha a consistência nos macros proteicos para otimizar a recuperação noturna.
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: VISUALS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Visual 1: Radar */}
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '240px', height: '240px', margin: '0 auto' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                                    <PolarGrid gridType="polygon" stroke="rgba(255,255,255,0.08)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Status" dataKey="A" stroke="#818cf8" strokeWidth={3} fill="#818cf8" fillOpacity={0.5} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Visual 2: Consistency Bar */}
                    <div style={{ height: '140px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>CONSISTÊNCIA (7 DIAS)</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>{historyData.filter(d => d.completed).length}/7</span>
                        </div>
                        <div style={{ height: '70px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={historyData} barSize={12}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} dy={5} />
                                    <Bar dataKey="completed" radius={[6, 6, 6, 6]}>
                                        {historyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.completed ? '#3b82f6' : '#1e293b'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* COACH INSIGHT / TIP SECTION - To fill A4 page */}
            <div style={{ marginTop: 'auto', marginBottom: '32px', padding: '24px', background: 'rgba(59,130,246,0.05)', borderRadius: '20px', border: '1px solid rgba(59,130,246,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ padding: '6px', background: '#3b82f6', borderRadius: '50%' }}>
                        <Brain size={14} color="white" />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'white', letterSpacing: '0.05em' }}>INSIGHT DO TREINADOR</span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6' }}>
                    Sua consistência na hidratação e proteínas é fundamental para a recuperação muscular.
                    Continue focando em atingir suas metas diárias para ver resultados progressivos na sua composição corporal.
                </p>
            </div>

            {/* FOOTER */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '24px', height: '24px', background: '#3b82f6', borderRadius: '6px' }} />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'white', letterSpacing: '0.05em' }}>AXION</span>
                </div>
                <span style={{ fontSize: '11px', color: '#475569' }}>Gerado via IA • DeepSeek Intelligence</span>
            </div>
        </div>
    );
};
