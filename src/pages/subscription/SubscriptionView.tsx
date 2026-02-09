import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, Crown, Star, Zap, Layout, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { billingService } from '../../services/BillingServiceFactory';
import { ProductDetails } from '../../services/IBillingService';
import { useCoachStore } from '../../store/coachStore';

interface SubscriptionViewProps {
    onClose: () => void;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [product, setProduct] = useState<ProductDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const { activatePremium } = useCoachStore();
    const { setPremium } = useUserStore();

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const details = await billingService.getProductDetails('axion_pro_monthly');
                setProduct(details);
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, []);

    const handlePurchase = async () => {
        if (!product) return;
        setProcessing(true);
        try {
            const success = await billingService.purchaseSubscription(product.productId);
            if (success) {
                activatePremium();
                setPremium(true);
                setTimeout(onClose, 500);
            }
        } catch (error) {
            console.error("Purchase failed", error);
            alert("Falha na compra. Tente novamente.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                position: 'fixed', inset: 0, zIndex: 9999, background: '#0f172a',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                fontFamily: "'Outfit', sans-serif"
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '32px', height: '32px', border: '3px solid #f59e0b',
                        borderTopColor: 'transparent', borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>Carregando ofertas...</span>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#0f172a',
            color: 'white',
            overflowY: 'auto',
            fontFamily: "'Outfit', sans-serif",
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); } 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); } }
            `}</style>

            {/* Background Effects */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px',
                    background: 'rgba(245, 158, 11, 0.15)', borderRadius: '50%', filter: 'blur(100px)'
                }} />
                <div style={{
                    position: 'absolute', bottom: '-10%', right: '-10%', width: '300px', height: '300px',
                    background: 'rgba(37, 99, 235, 0.1)', borderRadius: '50%', filter: 'blur(80px)'
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 10, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header / Close */}
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#e2e8f0', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ flex: 1, width: '100%', maxWidth: '480px', margin: '0 auto', padding: '0 24px 48px 24px', display: 'flex', flexDirection: 'column' }}>
                    {/* Hero Section */}
                    <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '16px' }}>
                        <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 24px auto' }}>
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(135deg, #fbbf24, #ea580c)',
                                borderRadius: '24px', filter: 'blur(20px)', opacity: 0.5
                            }} />
                            <div style={{
                                position: 'relative', width: '100%', height: '100%',
                                background: 'linear-gradient(135deg, #fbbf24, #ea580c)',
                                borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <Crown size={48} color="white" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                            </div>
                        </div>

                        <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                            Seja <span style={{
                                background: 'linear-gradient(to right, #fbbf24, #f97316)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>PRO</span>
                        </h1>
                        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.6', maxWidth: '280px', margin: '0 auto' }}>
                            Desbloqueie seu potencial máximo e acelere seus resultados.
                        </p>
                    </div>

                    {/* Benefits List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', flex: 1 }}>
                        <BenefitItem
                            icon={Layout}
                            title="Relatórios Avançados"
                            desc="Análises semanais detalhadas da sua evolução."
                            delay={100}
                        />
                        <BenefitItem
                            icon={Zap}
                            title="Sem Anúncios"
                            desc="Experiência 100% foca no seu treino."
                            delay={200}
                        />
                        <BenefitItem
                            icon={Star}
                            title="Coach IA Ilimitado"
                            desc="Seu personal trainer inteligente 24/7."
                            delay={300}
                        />
                    </div>

                    {/* Pricing Card */}
                    <div style={{
                        position: 'relative',
                        background: 'linear-gradient(to bottom, #0f172a, rgba(15, 23, 42, 0.5))',
                        borderRadius: '16px',
                        padding: '24px',
                        marginBottom: '24px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.5)'
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.5), transparent)'
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ color: '#fbbf24', fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em' }}>MENSAL</span>
                            <div style={{
                                background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24',
                                fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '50px',
                                border: '1px solid rgba(245, 158, 11, 0.2)'
                            }}>
                                MAIS POPULAR
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '36px', fontWeight: 900, color: 'white' }}>{product?.price || 'R$ 5,99'}</span>
                            <span style={{ color: '#64748b', fontSize: '16px', fontWeight: 500 }}>/ mês</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                            <CheckCircle2 size={14} color="#10b981" />
                            <span>Cancele quando quiser</span>
                            <span style={{ width: '3px', height: '3px', background: '#334155', borderRadius: '50%' }} />
                            <span>Renovação auto</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={handlePurchase}
                        disabled={processing}
                        style={{
                            position: 'relative', width: '100%', padding: '18px 24px', borderRadius: '14px',
                            fontSize: '18px', fontWeight: 700, color: 'white', border: '1px solid rgba(255,255,255,0.2)',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                            boxShadow: '0 8px 20px -4px rgba(245, 158, 11, 0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            cursor: processing ? 'not-allowed' : 'pointer',
                            opacity: processing ? 0.7 : 1, overflow: 'hidden',
                            transition: 'transform 0.2s',
                            animation: processing ? 'none' : 'pulse-glow 3s infinite'
                        }}
                    >
                        {processing ? (
                            <>
                                <div style={{
                                    width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite'
                                }} />
                                <span>Processando...</span>
                            </>
                        ) : (
                            <>
                                <span>Assinar Agora</span>
                                <ChevronRight size={22} strokeWidth={3} />
                            </>
                        )}
                    </button>

                    <button
                        onClick={async () => {
                            if (processing) return;
                            setProcessing(true);
                            try {
                                const restored = await billingService.restorePurchases();
                                if (restored) {
                                    activatePremium();
                                    setPremium(true);
                                    alert("Assinatura restaurada com sucesso!");
                                    setTimeout(onClose, 500);
                                } else {
                                    alert("Nenhuma assinatura ativa encontrada.");
                                }
                            } catch (e) {
                                console.error(e);
                                alert("Erro ao restaurar compras.");
                            } finally {
                                setProcessing(false);
                            }
                        }}
                        disabled={processing}
                        style={{
                            background: 'transparent', border: 'none', color: '#94a3b8',
                            fontSize: '14px', fontWeight: 500, marginTop: '16px',
                            cursor: 'pointer', textDecoration: 'underline', width: '100%',
                            opacity: processing ? 0.5 : 0.8
                        }}
                    >
                        Restaurar Compras
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '11px', color: '#475569', marginTop: '12px', lineHeight: '1.5' }}>
                        {t('subscription.cancel_anytime')}
                    </p>
                </div>
            </div>
        </div>
    );
};

const BenefitItem = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => (
    <div
        style={{
            display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px',
            borderRadius: '16px', background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(4px)',
            animation: `slideUp 0.5s ease-out ${delay}ms backwards`,
            transition: 'background 0.2s'
        }}
    >
        <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 88, 12, 0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            border: '1px solid rgba(245, 158, 11, 0.1)'
        }}>
            <Icon size={20} color="#fbbf24" strokeWidth={2} />
        </div>
        <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px', marginTop: 0 }}>{title}</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>{desc}</p>
        </div>
    </div>
);
