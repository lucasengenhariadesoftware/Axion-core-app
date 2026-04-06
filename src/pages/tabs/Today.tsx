import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../store/userStore';
import { generateDailyPlan } from '../../lib/planner';
import { CheckCircle2, Flame, Briefcase, GraduationCap, Calendar, Dumbbell, Bell, Music } from 'lucide-react';
import CaloriesCard from '../../components/today/CaloriesCard';
import HydrationCard from '../../components/today/HydrationCard';
import RoutineSetupCard from '../../components/today/RoutineSetupCard';
import DailyGoalsCard from '../../components/today/DailyGoalsCard';
import { InsightsPanel } from '../../components/coach/InsightsPanel';
import { MonthlyReport } from '../../components/coach/MonthlyReport';
import { SideMenu } from '../../components/layout/SideMenu';
import { NotesAccordion } from '../../components/today/NotesAccordion';

export default function TodayTab() {
    const { t } = useTranslation();
    // Use everything from the global store
    const {
        profile,
        dailyPlan,
        checkDailyReset
    } = useUserStore();

    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    useEffect(() => {
        if (profile) {
            const newPlan = generateDailyPlan(profile);
            // Check if we need to reset for a new day OR if the plan data is outdated (missing meta)
            // @ts-ignore - checking for legacy property
            const isInvalidPlan = !dailyPlan?.meta || (dailyPlan as any).waterTarget !== undefined;

            if (isInvalidPlan) {
                console.log("Invalid or legacy plan detected, resetting...");
                checkDailyReset('', newPlan); // Force reset by passing empty date to mismatch with lastPlanDate
            } else {
                checkDailyReset(new Date().toDateString(), newPlan);
            }
        }
    }, [profile, checkDailyReset, dailyPlan]);

    if (!dailyPlan || !dailyPlan.meta) return <div style={{ padding: '20px' }}>Atualizando plano...</div>;

    return (
        <div className="container" style={{ paddingTop: '20px' }}>
            <header style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>{t('today.title')}</h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    <div
                        onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: isSideMenuOpen ? '#374151' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            border: '1px solid #F3F4F6',
                            transition: 'all 0.2s',
                            zIndex: 10001,
                            position: 'relative'
                        }}>
                        <Music size={20} color={isSideMenuOpen ? 'white' : '#374151'} />
                    </div>
                </div>
            </header>

            <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />

            {/* Progress */}
            <DailyGoalsCard />

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>{t('today.routine')}</h2>

                <RoutineSetupCard />

                {/* Custom Routine Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                    {dailyPlan.routineItems?.map(item => {
                        const isDone = item.completed;
                        let typeColor = '#6B7280';
                        let typeBg = '#F3F4F6';

                        if (item.type === 'work') { typeColor = '#4F46E5'; typeBg = '#EEF2FF'; }
                        if (item.type === 'study') { typeColor = '#8B5CF6'; typeBg = '#F5F3FF'; }
                        if (item.type === 'training') { typeColor = '#EC4899'; typeBg = '#FDF2F8'; }
                        if (item.type === 'other') { typeColor = '#F59E0B'; typeBg = '#FFFBEB'; }

                        if (isDone) {
                            typeColor = '#10B981';
                            typeBg = '#ECFDF5';
                        }

                        return (
                            <div
                                key={item.id}
                                onClick={() => {
                                    // @ts-ignore
                                    useUserStore.getState().toggleRoutineItem(item.id)
                                }}
                                style={{
                                    marginBottom: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    cursor: 'pointer',
                                    padding: '16px',
                                    background: 'white',
                                    borderRadius: '16px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                                    border: isDone ? '1px solid #10B981' : '1px solid transparent',
                                    transition: 'all 0.2s ease',
                                    opacity: isDone ? 0.8 : 1
                                }}
                            >
                                <div style={{
                                    background: typeBg,
                                    padding: '12px',
                                    borderRadius: '14px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s'
                                }}>
                                    {item.type === 'work' && <Briefcase size={22} color={typeColor} />}
                                    {item.type === 'study' && <GraduationCap size={22} color={typeColor} />}
                                    {item.type === 'training' && <Dumbbell size={22} color={typeColor} />}
                                    {item.type === 'other' && <Calendar size={22} color={typeColor} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        color: isDone ? '#059669' : '#9CA3AF',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        marginBottom: '4px',
                                        display: 'flex', alignItems: 'center', gap: '6px'
                                    }}>
                                        {item.startTime} - {item.endTime}
                                    </div>
                                    <h3 style={{
                                        fontWeight: 700,
                                        fontSize: '16px',
                                        textDecoration: isDone ? 'line-through' : 'none',
                                        color: isDone ? '#6B7280' : '#1F2937',
                                        margin: 0,
                                        display: 'flex', alignItems: 'center', gap: '8px'
                                    }}>
                                        {item.title}
                                        {item.alarmEnabled && !isDone && (
                                            <Bell size={14} fill="#FCD34D" color="#F59E0B" />
                                        )}
                                    </h3>
                                </div>
                                <div style={{
                                    width: '24px', height: '24px',
                                    borderRadius: '50%',
                                    border: isDone ? 'none' : '2px solid #E5E7EB',
                                    background: isDone ? '#10B981' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {isDone && <CheckCircle2 size={16} color="white" />}
                                </div>
                            </div>
                        );
                    })}
                </div>


            </section>

            {/* Notes Accordion */}
            <div style={{ marginBottom: '32px' }}>
                <NotesAccordion />
            </div>

            {/* Nutrition Charts */}
            <CaloriesCard />

            {/* Water Tracker Section */}
            <HydrationCard />

            {/* Coach Insights & Report */}
            <div style={{ marginTop: '32px', margin: '0 -20px' }}>
                <InsightsPanel />
                <MonthlyReport />
            </div>
        </div>
    );
}
