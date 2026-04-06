import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Lock, Zap } from 'lucide-react';
import { useCoachStore } from '../../store/coachStore';
import { AdUnlockModal } from '../../components/ads/AdUnlockModal';
import { adService } from '../../services/AdService';

export const ChatInterface = () => {
    const { messages, sendMessage, isTyping, dailyMessageCount, premiumUntil, activatePremium } = useCoachStore();
    const [inputValue, setInputValue] = useState('');
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    const [isLoadingAd, setIsLoadingAd] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Check Premium Status
    const isPremium = Date.now() < premiumUntil;
    const messagesRemaining = Math.max(0, 3 - dailyMessageCount);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const success = sendMessage(inputValue);
        if (success) {
            setInputValue('');
        } else {
            // Limit Reached -> Show Ad Modal
            setIsAdModalOpen(true);
        }
    };

    const handleWatchAd = async () => {
        setIsLoadingAd(true);
        const success = await adService.showRewardedAd();
        setIsLoadingAd(false);

        if (success) {
            activatePremium();
            setIsAdModalOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const QuickAction = ({ label, prompt }: { label: string, prompt: string }) => (
        <button
            onClick={() => {
                setInputValue(prompt);
                // Optional: Auto-send or just fill? Let's just fill for now or verify logic
                // If auto-send:
                // if(sendMessage(prompt)) setInputValue(''); else setIsAdModalOpen(true);
            }}
            style={{
                flex: '0 0 auto',
                padding: '8px 16px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-alt)',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-primary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}
        >
            <Sparkles size={12} />
            {label}
        </button>
    );

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            background: '#f8fafc',
            borderRadius: '24px 24px 0 0',
            marginTop: '-20px', // Overlap header
            position: 'relative',
            zIndex: 10,
            overflow: 'hidden'
        }}>

            {/* STATUS BAR */}
            <div style={{
                padding: '12px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'white'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isPremium ? (
                        <>
                            <Zap size={14} fill="#f59e0b" color="#f59e0b" />
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>PREMIUM ATIVO</span>
                        </>
                    ) : (
                        <>
                            <Lock size={14} color="#64748b" />
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Básico</span>
                        </>
                    )}
                </div>
                {!isPremium && (
                    <span style={{ fontSize: '11px', color: messagesRemaining > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                        {messagesRemaining} mensagens restantes hoje
                    </span>
                )}
            </div>


            {/* Messages Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            display: 'flex',
                            gap: '8px',
                            flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                        }}
                    >
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: msg.sender === 'user' ? 'var(--color-primary)' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            {msg.sender === 'user' ? <User size={16} color="white" /> : <Bot size={16} color={isPremium ? "#f59e0b" : "#4f46e5"} />}
                        </div>

                        <div style={{
                            background: msg.sender === 'user' ? 'var(--color-primary)' : 'white',
                            color: msg.sender === 'user' ? 'white' : 'var(--color-text-main)',
                            padding: '12px 16px',
                            borderRadius: msg.sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                            boxShadow: 'var(--shadow-sm)',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            border: msg.sender === 'ai' && isPremium ? '1px solid #fcd34d' : 'none'
                        }}>
                            {/* Render text with basic markdown-like breaks */}
                            {msg.text.split('\n').map((line, i) => (
                                <p key={i} style={{ margin: line.trim() === '' ? '8px 0' : '0' }}>{line}</p>
                            ))}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div style={{ alignSelf: 'flex-start', marginLeft: '40px', background: 'white', padding: '12px', borderRadius: '4px 16px 16px 16px' }}>
                        <div className="typing-dot" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1', marginRight: '4px', animation: 'typing 1.4s infinite' }}></div>
                        <div className="typing-dot" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1', marginRight: '4px', animation: 'typing 1.4s infinite 0.2s' }}></div>
                        <div className="typing-dot" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1', animation: 'typing 1.4s infinite 0.4s' }}></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
                padding: '16px 16px 100px 16px',
                background: 'white',
                borderTop: '1px solid #f1f5f9'
            }}>
                {/* Horizontal Quick Actions */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'auto',
                    paddingBottom: '12px',
                    marginBottom: '8px',
                    scrollbarWidth: 'none'
                }}>
                    <QuickAction label="Analisar meu dia" prompt="Analisar meu dia" />
                    <QuickAction label="Estou sem energia" prompt="Porque estou sem energia à tarde?" />
                    <QuickAction label="Não consigo focar" prompt="Não consigo focar" />
                    <QuickAction label="Melhorar treino" prompt="Quero melhorar meu treino" />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isPremium ? "Pergunte qualquer coisa (Premium ativo)..." : `Perguntas restantes: ${messagesRemaining}...`}
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: '24px',
                            border: '1px solid #e2e8f0',
                            background: '#f8fafc',
                            outline: 'none',
                            fontSize: '14px'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: inputValue.trim() ? (isPremium ? '#f59e0b' : 'var(--color-primary)') : '#cbd5e1',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        <Send size={18} color="white" />
                    </button>
                </div>
            </div>

            <AdUnlockModal
                isOpen={isAdModalOpen}
                onClose={() => setIsAdModalOpen(false)}
                onWatch={handleWatchAd}
                isLoadingAd={isLoadingAd}
                title="Desbloquear 5h Premium"
                description="Assista a um breve anúncio para ganhar 5 horas de acesso ilimitado ao Coach IA e Análises Profundas."
                confirmText="Assistir para Liberar"
            />

            <style>{`
                @keyframes typing {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
            `}</style>
        </div>
    );
};
