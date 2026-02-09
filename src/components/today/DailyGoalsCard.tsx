
import { useMemo } from 'react';
import { Card } from '../ui/Card';
import { useUserStore } from '../../store/userStore';
import { CheckCircle2, Trophy, Target } from 'lucide-react';

export default function DailyGoalsCard() {
    const { dailyPlan } = useUserStore();

    const { progress, totalTasks, completedTasks } = useMemo(() => {
        const routineItems = dailyPlan?.routineItems || [];
        const total = routineItems.length;
        const completed = routineItems.filter(i => i.completed).length;
        const prog = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { progress: prog, totalTasks: total, completedTasks: completed };
    }, [dailyPlan?.routineItems]);

    // Motivational text based on progress
    const getMessage = () => {
        if (totalTasks === 0) return "Adicione tarefas à sua rotina!";
        if (progress === 0) return "Vamos começar o dia com tudo!";
        if (progress < 50) return "Bom começo, continue assim!";
        if (progress < 100) return "Quase lá! Mantenha o foco.";
        return "Parabéns! Todas as metas atingidas.";
    };

    return (
        <Card style={{
            padding: '0',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
        }}>
            {/* Abstract Background Shapes */}
            <div style={{
                position: 'absolute', top: '-20px', right: '-20px',
                width: '120px', height: '120px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                opacity: 0.15, borderRadius: '50%', filter: 'blur(20px)'
            }} />
            <div style={{
                position: 'absolute', bottom: '-30px', left: '-10px',
                width: '100px', height: '100px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                opacity: 0.1, borderRadius: '50%', filter: 'blur(24px)'
            }} />

            <div style={{ padding: '24px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Target size={18} color="#10B981" />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#D1D5DB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Produtividade
                            </span>
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, background: 'linear-gradient(to right, #fff, #D1D5DB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {progress}% Concluído
                        </h2>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(4px)',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <span style={{ fontWeight: 700, fontSize: '15px' }}>{completedTasks}/{totalTasks}</span>
                        {progress === 100 ? <Trophy size={16} color="#FBBF24" fill="#FBBF24" /> : <CheckCircle2 size={16} color="#10B981" />}
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div style={{
                    height: '14px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '99px',
                    marginBottom: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }}>
                    {/* Active Bar */}
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                        borderRadius: '99px',
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
                    }}>
                        {/* Shimmer Effect */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                            transform: 'skewX(-20deg)',
                            width: '50%',
                            animation: 'shimmer 2s infinite linear',
                            opacity: 0.5
                        }} />
                    </div>
                </div>

                <p style={{
                    fontSize: '14px',
                    color: '#9CA3AF',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 500
                }}>
                    {getMessage()}
                </p>
            </div>

            <style>{`
                @keyframes shimmer {
                    from { transform: translateX(-150%) skewX(-20deg); }
                    to { transform: translateX(250%) skewX(-20deg); }
                }
            `}</style>
        </Card>
    );
}
