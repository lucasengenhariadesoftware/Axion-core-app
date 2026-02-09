import React from 'react';
import { Play, X, Lock, Gem } from 'lucide-react';

interface AdUnlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onWatch: () => void;
    isLoadingAd: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
}

export const AdUnlockModal: React.FC<AdUnlockModalProps> = ({
    isOpen,
    onClose,
    onWatch,
    isLoadingAd,
    title = "Desbloquear Recurso",
    description = "Assista a um vídeo rápido para liberar este recurso gratuitamente.",
    confirmText = "Assistir para Liberar"
}) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.8)', // Slate 900 with opacity
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
        }}>
            <div className="animate-enter" style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px 24px',
                width: '100%',
                maxWidth: '340px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                {/* Close Button (delayed appearance usually better, but keeping simple) */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        padding: '4px',
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <Lock size={32} className="text-blue-500" color="#3b82f6" />
                </div>

                <h3 style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: '12px',
                    lineHeight: '1.2'
                }}>
                    {title}
                </h3>

                <p style={{
                    fontSize: '15px',
                    color: '#64748b',
                    marginBottom: '32px',
                    lineHeight: '1.5'
                }}>
                    {description}
                </p>

                {/* Primary Action */}
                <button
                    onClick={onWatch}
                    disabled={isLoadingAd}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: '#3b82f6', // Blue 500
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '15px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        cursor: isLoadingAd ? 'wait' : 'pointer',
                        transition: 'transform 0.1s',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}
                >
                    {isLoadingAd ? (
                        <span>Carregando anúncio...</span>
                    ) : (
                        <>
                            <Play size={18} fill="currentColor" />
                            {confirmText}
                        </>
                    )}
                </button>

                {/* Secondary Action */}
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '8px'
                    }}
                >
                    Agora Não
                </button>

                {/* Premium Hint */}
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                    <Gem size={12} color="#f59e0b" />
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Membros Premium não veem anúncios.</span>
                </div>
            </div>
        </div>
    );
};
