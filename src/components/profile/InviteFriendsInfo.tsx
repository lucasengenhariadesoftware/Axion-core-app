import React from 'react';
import { Gift, Copy, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const InviteFriendsInfo: React.FC = () => {
    const handleCopy = () => {
        navigator.clipboard.writeText('axioncore.fit/u/lucas92');
        alert('Link copiado para a área de transferência!');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'AXION CORE',
                text: 'Ganhe 1 mês grátis no AXION CORE!',
                url: 'https://axioncore.fit/u/lucas92',
            }).catch(console.error);
        } else {
            handleCopy();
        }
    };

    return (
        <div style={{
            background: '#F8FAFC',
            borderRadius: '16px',
            padding: '16px',
            marginTop: '8px',
            border: '1px solid #E2E8F0',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative Background Gradient */}
            <div style={{
                position: 'absolute',
                top: 0, right: 0,
                width: '100px', height: '100px',
                background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '0 0 0 100%'
            }} />

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                    borderRadius: '12px',
                    padding: '12px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(219, 39, 119, 0.3)'
                }}>
                    <Gift size={24} strokeWidth={2.5} />
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#BE185D', marginBottom: '2px' }}>
                        Ganhe 1 Mês Grátis
                    </h3>
                    <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>
                        Convide amigos e ganhe 1 mês de Premium assim que eles assinarem com cartão.
                    </p>
                </div>
            </div>

            {/* Link Box */}
            <div style={{
                background: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
            }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>axioncore.fit/u/lucas92</span>
                <button
                    onClick={handleCopy}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#2563EB',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        fontWeight: 700
                    }}
                >
                    <Copy size={12} />
                    COPIAR
                </button>
            </div>

            {/* Steps or Benefits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={12} color="#10B981" />
                    <span style={{ fontSize: '11px', color: '#475569' }}>Seu amigo ganha 7 dias grátis</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={12} color="#10B981" />
                    <span style={{ fontSize: '11px', color: '#475569' }}>Você ganha 1 mês de AXION Pro</span>
                </div>
            </div>

            <Button
                onClick={handleShare}
                fullWidth
                size="sm"
                style={{
                    marginTop: '16px',
                    background: '#DB2777',
                    border: 'none',
                    boxShadow: '0 4px 10px rgba(219, 39, 119, 0.2)'
                }}
            >
                Compartilhar Link
            </Button>
        </div>
    );
};
