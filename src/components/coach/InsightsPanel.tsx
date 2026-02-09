import { useState, useEffect } from 'react';
import { useCoachStore, Insight } from '../../store/coachStore';
import { TrendingUp, AlertTriangle, Target, Lightbulb, Zap } from 'lucide-react';

export const InsightsPanel = () => {
    const { insights } = useCoachStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % insights.length);
                setIsTransitioning(false);
            }, 300); // Wait for fade out
        }, 8000); // 8 seconds per slide

        return () => clearInterval(interval);
    }, [insights.length]);

    const getIcon = (type: Insight['type']) => {
        switch (type) {
            case 'positive': return <TrendingUp size={20} color="#059669" />;
            case 'warning': return <AlertTriangle size={20} color="#eab308" />;
            case 'opportunity': return <Target size={20} color="#4f46e5" />;
            default: return <Lightbulb size={20} color="#6366f1" />;
        }
    };

    const getBgColor = (type: Insight['type']) => {
        switch (type) {
            case 'positive': return '#ecfdf5';
            case 'warning': return '#fefce8';
            case 'opportunity': return '#eef2ff';
            default: return '#f8fafc';
        }
    };

    const getBorderColor = (type: Insight['type']) => {
        switch (type) {
            case 'positive': return '#a7f3d0';
            case 'warning': return '#fde047';
            case 'opportunity': return '#c7d2fe';
            default: return '#e2e8f0';
        }
    };

    const currentInsight = insights[currentIndex];

    if (!currentInsight) return null;

    return (
        <div style={{ padding: '0 20px 24px 20px' }}>
            <h3 style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <Zap size={16} fill="#F59E0B" color="#F59E0B" />
                Insights & Descobertas
            </h3>

            <div style={{ position: 'relative', minHeight: '120px' }}>
                <div
                    style={{
                        background: getBgColor(currentInsight.type),
                        border: `1px solid ${getBorderColor(currentInsight.type)}`,
                        borderRadius: '20px',
                        padding: '20px',
                        display: 'flex',
                        gap: '16px',
                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                        opacity: isTransitioning ? 0 : 1,
                        transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                    }}
                >
                    <div style={{
                        background: 'white',
                        borderRadius: '14px',
                        padding: '10px',
                        height: 'fit-content',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {getIcon(currentInsight.type)}
                    </div>

                    <div style={{ flex: 1 }}>
                        <h4 style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: '#1e293b',
                            marginBottom: '6px',
                            letterSpacing: '-0.01em'
                        }}>
                            {currentInsight.title}
                        </h4>
                        <p style={{
                            fontSize: '13px',
                            color: '#475569',
                            lineHeight: '1.5',
                            fontWeight: 500
                        }}>
                            {currentInsight.description}
                        </p>
                    </div>
                </div>

                {/* Pagination Dots */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '12px'
                }}>
                    {insights.map((_, idx) => (
                        <div
                            key={idx}
                            style={{
                                width: idx === currentIndex ? '24px' : '6px',
                                height: '6px',
                                borderRadius: '3px',
                                background: idx === currentIndex ? '#64748b' : '#cbd5e1',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
