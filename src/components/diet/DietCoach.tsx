import { useState, useEffect } from 'react';
import { Sparkles, X, Zap, TrendingUp, Clock, Wallet } from 'lucide-react';
import { useDietStore } from '../../store/dietStore';
import { CoachingMessage } from '../../types/diet';

import { generateCoachMessage } from '../../lib/coachLogic';

export default function DietCoach() {
    const { coachMessages, dismissCoachMessage, setCoachMessages, learningProfile, preferences } = useDietStore();
    const [activeMessage, setActiveMessage] = useState<CoachingMessage | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // AI Insight Generation Real
    useEffect(() => {
        // Se não tem mensagens ativas, gera uma nova aleatória para dar sensação de "vida"
        const active = coachMessages.find(m => !m.dismissed);

        if (!active) {
            // Gera nova
            const newMessage = generateCoachMessage(learningProfile, preferences);
            setCoachMessages([newMessage]); // Em app real seria push/append
            setActiveMessage(newMessage);
            setTimeout(() => setIsVisible(true), 100);
        } else {
            setActiveMessage(active);
            setIsVisible(true);
        }
    }, [coachMessages, learningProfile, preferences, setCoachMessages]);

    const handleDismiss = () => {
        setIsVisible(false);
        if (activeMessage) {
            setTimeout(() => dismissCoachMessage(activeMessage.id), 300); // Wait for anim
        }
    };

    if (!activeMessage) return null;

    // Icon logic based on category
    const getIcon = () => {
        switch (activeMessage.category) {
            case 'economy': return <Wallet size={20} className="text-emerald-200" />;
            case 'time': return <Clock size={20} className="text-amber-200" />;
            case 'health': return <TrendingUp size={20} className="text-rose-200" />;
            default: return <Sparkles size={20} className="text-purple-200" />;
        }
    };

    const getGradient = () => {
        switch (activeMessage.category) {
            case 'economy': return 'linear-gradient(135deg, #059669 0%, #047857 100%)'; // Emerald
            case 'time': return 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'; // Amber
            case 'health': return 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)'; // Rose
            default: return 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'; // Purple (Default)
        }
    };

    if (!isVisible) return null;

    return (
        <div className="animate-slide-down" style={{ marginBottom: '24px', transition: 'all 0.3s ease' }}>
            <div style={{
                background: getGradient(),
                borderRadius: '24px', // Mais arredondado = mais moderno
                padding: '24px',
                color: 'white',
                position: 'relative',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)', // Sombra premium
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.15)',
                            padding: '10px',
                            borderRadius: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(4px)'
                        }}>
                            {getIcon()}
                        </div>
                        <div>
                            <span style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                opacity: 0.8,
                                fontWeight: 700
                            }}>
                                {activeMessage.category === 'habit' ? 'Análise de Hábito' : 'Sugestão Smart'}
                            </span>
                            <span style={{
                                fontSize: '1.1rem',
                                fontWeight: 800,
                                lineHeight: '1.2'
                            }}>
                                {activeMessage.title || 'Insight'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        style={{
                            background: 'rgba(0,0,0,0.1)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '6px',
                            borderRadius: '50%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            transition: 'background 0.2s'
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <p style={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    lineHeight: 1.5,
                    marginBottom: '24px',
                    opacity: 0.95,
                    color: 'rgba(255,255,255,0.95)'
                }}>
                    {activeMessage.text}
                </p>

                {/* Action Button */}
                {activeMessage.actionLabel && (
                    <button
                        style={{
                            background: 'white',
                            color: '#1F2937', // Dark gray text for contrast
                            border: 'none',
                            padding: '16px 20px', // Botão grande e clicável
                            borderRadius: '16px',
                            fontSize: '0.95rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            width: '100%',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'transform 0.1s active'
                        }}
                        onClick={() => {
                            // TODO: Implement actual action logic
                            handleDismiss();
                        }}
                    >
                        <Zap size={18} className={activeMessage.category === 'health' ? 'text-rose-500' : 'text-purple-600'} fill="currentColor" />
                        {activeMessage.actionLabel}
                    </button>
                )}
            </div>
        </div>
    );
}
