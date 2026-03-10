import React, { useRef, useState, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { Download, Loader2, Play, Lock } from 'lucide-react';
import { AxionReportTemplate } from './AxionReportTemplate';
import { adService } from '../../services/AdService';
import { AdUnlockModal } from '../ads/AdUnlockModal';
import { useUserStore } from '../../store/userStore';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export const MonthlyReport = () => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    const [isAdLoading, setIsAdLoading] = useState(false);

    const { isPremium: globalPremium } = useUserStore();
    const isPremium = globalPremium; // Reports are only free for subscribers, not temporary coach unlock

    useEffect(() => {
        // Preload ad when component mounts
        if (!isPremium) {
            adService.loadRewardedAd();
        }
    }, [isPremium]);

    const data = [
        { subject: 'Foco', A: 85, fullMark: 100 },
        { subject: 'Energia', A: 65, fullMark: 100 },
        { subject: 'Força', A: 90, fullMark: 100 },
        { subject: 'Nutrição', A: 70, fullMark: 100 },
        { subject: 'Sono', A: 50, fullMark: 100 },
        { subject: 'Equilíbrio', A: 80, fullMark: 100 },
    ];

    const generatePDF = async () => {
        if (!reportRef.current) return;
        setIsGenerating(true);

        const element = reportRef.current;
        const opt = {
            margin: 0,
            filename: 'relatorio_axion_semanal.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        } as any;

        try {
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("PDF Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadClick = () => {
        if (isPremium) {
            generatePDF();
        } else {
            setIsAdModalOpen(true);
        }
    };

    const handleWatchAd = async () => {
        setIsAdLoading(true);
        try {
            const rewardEarned = await adService.showRewardedAd();
            setIsAdLoading(false);

            if (rewardEarned) {
                // Separate unlock: Does NOT activate global premium.
                // Just allows THIS download.

                setIsAdModalOpen(false);
                // Small delay to ensure modal close animation finishes / user context switch
                setTimeout(() => {
                    generatePDF();
                }, 500);
            } else {
                // If ad failed to show (e.g. adblock or no fill), consider skipping or warning
                console.log("Ad not completed or failed.");
                alert("Não foi possível carregar o anúncio. Tente novamente mais tarde.");
            }
        } catch (error) {
            console.error("Ad error", error);
            setIsAdLoading(false);
            alert("Erro ao carregar anúncio.");
        }
    };

    return (
        <div style={{ padding: '0 20px 100px 20px' }}>
            <AdUnlockModal
                isOpen={isAdModalOpen}
                onClose={() => setIsAdModalOpen(false)}
                onWatch={handleWatchAd}
                isLoadingAd={isAdLoading}
                title="Desbloquear Relatório"
                description="Assista a um vídeo rápido para baixar seu Relatório Semanal Completo."
                confirmText="Baixar Agora (Grátis)"
            />

            {/* Hidden Report Template for PDF Generation */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <div ref={reportRef}>
                    <AxionReportTemplate />
                </div>
            </div>

            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid #f1f5f9'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>
                        Relatório AXION
                    </h3>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Janeiro 2026</span>
                </div>

                <div style={{ height: '240px', width: '100%', marginBottom: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                            <Radar
                                name="Você"
                                dataKey="A"
                                stroke="var(--color-primary)"
                                fill="var(--color-primary)"
                                fillOpacity={0.4}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ flex: 1, padding: '12px', background: '#ecfdf5', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '10px', color: '#059669', marginBottom: '4px' }}>Destaque</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#047857' }}>+15% Força</span>
                    </div>
                    <div style={{ flex: 1, padding: '12px', background: '#fefce8', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '10px', color: '#ca8a04', marginBottom: '4px' }}>Atenção</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#a16207' }}>-10% Sono</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {!isPremium && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                            <Lock size={12} color="#64748b" />
                            <span style={{ fontSize: '11px', color: '#64748b' }}>Recurso Premium Bloqueado</span>
                        </div>
                    )}
                    <button
                        onClick={handleDownloadClick}
                        disabled={isGenerating}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',

                            background: isPremium ? 'white' : '#3b82f6', // White for download, Blue for Unlock
                            color: isPremium ? '#0f172a' : 'white',
                            border: isPremium ? '1px solid #e2e8f0' : 'none',
                            fontWeight: 700,
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: isGenerating ? 'not-allowed' : 'pointer',
                            opacity: isGenerating ? 0.7 : 1,
                            boxShadow: isPremium ? 'none' : '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
                        }}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                {isPremium ? 'Gerando PDF...' : 'Carregando...'}
                            </>
                        ) : isPremium ? (
                            <>
                                <Download size={16} />
                                Baixar Relatório Completo (PDF)
                            </>
                        ) : (
                            <>
                                <Play size={16} fill="currentColor" />
                                Desbloquear Relatório (Grátis)
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
