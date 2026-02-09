import { useState, useMemo } from 'react';
import { useUserStore } from '../../store/userStore';
import { AdManager } from '../../services/AdManager';
import { BodyRecordForm } from '../../components/progress/BodyRecordForm';
import { EvolutionGallery } from '../../components/progress/EvolutionGallery';
import { Ruler, Scale, Calendar, ArrowUpRight, ArrowDownRight, Minus, BookOpen, Plus } from 'lucide-react';
import './Progress.css';

export default function ProgressTab() {
    const { profile, bodyRecords, addBodyRecord } = useUserStore();
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Stats Logic
    const currentRecord = bodyRecords[0];
    const previousRecord = bodyRecords[1];

    const measuresList = useMemo(() => {
        // Default list of key measures
        const keys = [
            { label: 'Pescoço', key: 'neck' },
            { label: 'Ombros', key: 'shoulders' },
            { label: 'Peitoral', key: 'chest' },
            { label: 'Cintura', key: 'waist' },
            { label: 'Abdômen', key: 'abdomen' },
            { label: 'Quadril', key: 'hips' },
            { label: 'Braço Esq.', key: 'armLeft' },
            { label: 'Braço Dir.', key: 'armRight' },
            { label: 'Antebraço Esq.', key: 'forearmLeft' },
            { label: 'Antebraço Dir.', key: 'forearmRight' },
            { label: 'Coxa Esq.', key: 'thighLeft' },
            { label: 'Coxa Dir.', key: 'thighRight' },
            { label: 'Panturrilha Esq.', key: 'calfLeft' },
            { label: 'Panturrilha Dir.', key: 'calfRight' },
        ];

        if (!currentRecord?.measures) return keys.map(k => ({ ...k, value: 0, diff: 0 }));

        return keys.map(item => {
            const current = currentRecord.measures?.[item.key as keyof typeof currentRecord.measures] || 0;
            const prev = previousRecord?.measures?.[item.key as keyof typeof previousRecord.measures] || 0;
            const diff = prev ? Number((current - prev).toFixed(1)) : 0;
            return {
                ...item,
                value: current,
                diff
            };
        });
    }, [currentRecord, previousRecord]);

    // Calculate Age
    const calculateAge = (birthDateString?: string) => {
        if (!birthDateString) return '--';
        const birthDate = new Date(birthDateString + 'T12:00:00');
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(profile?.birthDate);

    const handleSavePhotos = (photoData: { front?: string; side?: string; back?: string; date: string }) => {
        // Check if a record already exists for this date
        const existingRecord = bodyRecords.find(r => r.date === photoData.date);

        if (existingRecord) {
            // Update existing record
            const updatedRecord = {
                ...existingRecord,
                photos: {
                    front: photoData.front || existingRecord.photos?.front,
                    side: photoData.side || existingRecord.photos?.side,
                    back: photoData.back || existingRecord.photos?.back
                }
            };

            useUserStore.getState().deleteBodyRecord(existingRecord.id);
            addBodyRecord(updatedRecord);
        } else {
            // Create new record
            // Use simple ID generator if uuid is not available or just use uuid
            const newId = Math.random().toString(36).substring(2, 9);

            addBodyRecord({
                id: newId,
                date: photoData.date,
                weight: currentRecord?.weight || profile?.weight || 0, // Fallback to current weight
                photos: {
                    front: photoData.front,
                    side: photoData.side,
                    back: photoData.back
                }
            });
        }

        // Show Ad after saving
        AdManager.showInterstitial();
    };

    return (
        <div className="container progress-container">
            {/* Header Section */}
            <header className="progress-header">
                <span className="eyebrow-text">
                    Estatísticas
                </span>
                <h1 className="page-title">Minhas Medidas</h1>
                <p className="page-subtitle">
                    Acompanhe suas medidas e fotos ao longo do tempo.
                </p>
            </header>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <Ruler size={18} />
                        </div>
                        <span className="stat-value">{profile?.height ? profile.height / 100 : '--'} m</span>
                        <span className="stat-label">Altura</span>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <Scale size={18} />
                        </div>
                        <span className="stat-value">{currentRecord?.weight || profile?.weight || '--'} Kg</span>
                        <span className="stat-label">Peso Atual</span>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <Calendar size={18} />
                        </div>
                        <span className="stat-value">{age}</span>
                        <span className="stat-label">Anos</span>
                    </div>
                </div>

                {/* Ideal Weight Card */}
                <div className="feature-card">
                    <div className="feature-header">
                        <div className="feature-icon-circle" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
                            <Scale size={24} />
                        </div>
                        <h3 className="feature-title">Peso Ideal</h3>
                        <div className="feature-badge-right" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                            {(profile?.height ? 22 * Math.pow(profile.height / 100, 2) : 0).toFixed(1)} Kg
                        </div>
                    </div>
                    <p className="ideal-weight-desc">
                        Baseado no seu IMC, mantenha-se nessa faixa para otimizar sua saúde e performance.
                    </p>
                </div>

                {/* Evolution Section (New Gallery) */}
                <EvolutionGallery
                    records={bodyRecords}
                    onSavePhoto={handleSavePhotos}
                />

                {/* Call to Action Card */}
                <div className="cta-gradient-card">
                    <div className="cta-bg-deco"></div>
                    <div className="cta-content">
                        {(() => {
                            if (bodyRecords.length === 0) {
                                return (
                                    <>
                                        <h3 className="cta-title">
                                            Comece sua jornada!
                                        </h3>
                                        <p className="cta-desc">
                                            Registre sua primeira avaliação física para desbloquear gráficos e métricas detalhadas.
                                        </p>
                                        <button
                                            onClick={() => setIsFormOpen(true)}
                                            className="btn-white"
                                        >
                                            <Plus size={16} />
                                            Cadastrar Avaliação
                                        </button>
                                    </>
                                );
                            }

                            const latestRecord = bodyRecords[0];
                            const baseDate = new Date(latestRecord.date + 'T12:00:00');
                            const nextDate = new Date(baseDate);
                            nextDate.setDate(baseDate.getDate() + 90);

                            const today = new Date();
                            const diffTime = nextDate.getTime() - today.getTime();
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            const formattedDate = nextDate.toLocaleDateString('pt-BR');

                            return (
                                <div className="cta-inner-content">
                                    <div className="cta-header-row">
                                        <div className="cta-icon-wrapper">
                                            <Calendar size={20} color="#059669" />
                                        </div>
                                        <h3 className="cta-title">
                                            Próxima Avaliação
                                        </h3>
                                    </div>
                                    <p className="cta-desc">
                                        {diffDays > 0 ? (
                                            <>
                                                Sua reavaliação está prevista para <span className="cta-date">{formattedDate}</span>.
                                                <br />
                                                <span className="cta-days-left">Faltam {diffDays} dias</span> Mantenha o foco!
                                            </>
                                        ) : (
                                            "Sua avaliação está agendada! Prepare-se para ver seus resultados."
                                        )}
                                    </p>
                                </div>
                            );
                        })()}
                    </div>
                </div>



                {/* Form expands here when open */}
                {isFormOpen && <BodyRecordForm onClose={() => setIsFormOpen(false)} variant="inline" />}

                {/* Perimetry Section */}
                <div className="feature-card">
                    <div className="feature-header">
                        <div className="feature-icon-circle" style={{ backgroundColor: '#f0f9ff', color: '#0ea5e9' }}>
                            <BookOpen size={24} />
                        </div>
                        <h3 className="feature-title">Perimetria</h3>
                    </div>

                    <div className="perimetry-list">
                        {measuresList.map((item, idx) => (
                            <div key={idx} className="perimetry-row">
                                <div>
                                    <p className="measure-label">{item.label}</p>
                                    <div className="flex items-baseline">
                                        <span className="measure-value">{item.value}</span>
                                        <span className="measure-unit">cm</span>
                                    </div>
                                </div>

                                <div className={`trend-pill ${item.diff > 0 ? 'positive' : item.diff < 0 ? 'negative' : 'neutral'}`}>
                                    <span>{item.diff > 0 ? '+' : ''}{item.diff}</span>
                                    {item.diff > 0 ? <ArrowUpRight size={14} /> : item.diff < 0 ? <ArrowDownRight size={14} /> : <Minus size={14} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* FAB */}
            {/* FAB */}
            <button
                onClick={() => setIsFormOpen(true)}
                className="fab-primary"
                aria-label="Nova Avaliação"
                style={{
                    bottom: useUserStore.getState().isPremium ? '90px' : '160px', // Adjusted significantly for Free Ad Space
                    transition: 'bottom 0.3s ease'
                }}
            >
                <Plus size={28} />
            </button>
        </div>
    );
}
