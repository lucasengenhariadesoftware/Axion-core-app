import React from 'react';
import { useUserStore } from '../../store/userStore';
import { useCoachStore } from '../../store/coachStore';
import { Zap, Activity, Brain } from 'lucide-react';

export const CoachHeader = () => {
    const { profile } = useUserStore();
    const { dailyScore, scoreDelta, status } = useCoachStore();

    const getTrafficLightColor = (status: 'good' | 'warning' | 'critical') => {
        switch (status) {
            case 'good': return '#22c55e';
            case 'warning': return '#eab308';
            case 'critical': return '#ef4444';
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '24px 20px',
            borderRadius: '0 0 24px 24px',
            color: 'white',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
        }}>
            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
                    Bom dia, {profile?.name?.split(' ')[0] || 'Atleta'}!
                </h1>
                <p style={{ opacity: 0.8, fontSize: '14px' }}>
                    Sexta-feira é seu dia mais produtivo 💪
                </p>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.05)',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* Score Section */}
                <div>
                    <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7, marginBottom: '4px' }}>
                        Seu Equilíbrio Axion
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '28px', fontWeight: 800 }}>{dailyScore}/100</span>
                        <span style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: scoreDelta >= 0 ? '#4ade80' : '#f87171'
                        }}>
                            {scoreDelta >= 0 ? '+' : ''}{scoreDelta} vs ontem
                        </span>
                    </div>
                </div>

                {/* Status Lights */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    {[
                        { icon: Brain, status: status.focus, label: 'Foco' },
                        { icon: Zap, status: status.energy, label: 'Energia' },
                        { icon: Activity, status: status.recovery, label: 'Recup' },
                    ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <item.icon size={16} />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-2px',
                                    right: '-2px',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: getTrafficLightColor(item.status),
                                    border: '2px solid #0f172a'
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
