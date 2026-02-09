import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useUserStore } from '../../store/userStore';
import { ChevronRight, Settings, LogOut, Crown, Home, BarChart2, Check, Shield, Camera, Image as ImageIcon, X, RefreshCw } from 'lucide-react';
import { generateWeeklyPlan } from '../../lib/workout_logic';
import { HomeEquipmentForm } from '../../components/workout/HomeEquipmentForm';
import { billingService } from '../../services/BillingServiceFactory';
import { useCoachStore } from '../../store/coachStore';

interface MenuItemProps {
    icon: React.ElementType;
    label: string;
    badge?: string;
    onClick?: () => void;
    active?: boolean;
    showChevron?: boolean;
    isDanger?: boolean;
    isOpen?: boolean;
}

const MenuItem = ({ icon: Icon, label, badge, onClick, active, showChevron = true, isDanger = false, isOpen = false }: MenuItemProps) => (
    <div
        onClick={onClick}
        style={{
            background: 'var(--color-surface-alt)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            cursor: 'pointer',
            border: active || isOpen ? '2px solid var(--color-primary)' : '1px solid transparent',
            transition: 'all 0.2s',
        }}
    >
        <div style={{
            marginRight: '16px',
            color: isDanger ? 'var(--color-error)' : (active || isOpen) ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center'
        }}>
            <Icon size={20} strokeWidth={2.5} />
        </div>

        <span style={{
            flex: 1,
            fontSize: '14px',
            fontWeight: 700,
            color: isDanger ? 'var(--color-error)' : 'var(--color-text-main)',
            textTransform: 'uppercase',
            letterSpacing: '0.02em'
        }}>
            {label}
        </span>

        {badge && (
            <span style={{
                background: 'var(--color-surface)',
                color: 'var(--color-text-secondary)',
                fontSize: '10px',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '6px',
                marginRight: '12px'
            }}>
                {badge}
            </span>
        )}

        {showChevron && (
            <ChevronRight
                size={16}
                color="var(--color-text-secondary)"
                style={{
                    opacity: 0.5,
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                }}
            />
        )}
    </div>
);

// Internal Weight Tracker Component
const WeightTracker = () => {
    const { bodyRecords, addBodyRecord, deleteBodyRecord, profile } = useUserStore();
    const [weight, setWeight] = useState<string>(profile?.weight?.toString() || '');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSave = () => {
        if (!weight || isNaN(Number(weight))) {
            alert('Por favor, insira um peso válido.');
            return;
        }

        const numWeight = Number(weight);
        const existingRecord = bodyRecords.find(r => r.date === date);

        if (existingRecord) {
            deleteBodyRecord(existingRecord.id);
            addBodyRecord({
                ...existingRecord,
                weight: numWeight
            });
        } else {
            const newId = Math.random().toString(36).substring(2, 9);
            addBodyRecord({
                id: newId,
                date: date,
                weight: numWeight,
                photos: {} // Fixed: using object instead of array as per fix
            });
        }

        // Also update profile current weight
        useUserStore.getState().updateProfile({ weight: numWeight });

        alert('Peso registrado com sucesso!');
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9'
        }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>
                Registrar Peso
            </h3>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Peso (kg)</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="0.0"
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '16px',
                            fontWeight: 600,
                            outline: 'none'
                        }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Data</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '14px',
                            fontWeight: 500,
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                style={{
                    width: '100%',
                    background: 'var(--color-primary)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}
            >
                <Check size={18} />
                Salvar Registro
            </button>

            {/* Mini History */}
            {bodyRecords.length > 0 && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px', color: '#64748b', textTransform: 'uppercase' }}>Histórico Recente</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {bodyRecords
                            .filter(r => r.weight && r.weight > 0)
                            .slice(0, 5)
                            .map(record => (
                                <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <span style={{ color: '#64748b' }}>{new Date(record.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{record.weight} kg</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

import { WorkoutModeSelector } from '../../components/workout/WorkoutModeSelector';
import { SubscriptionView } from '../subscription/SubscriptionView'; // Add import

export default function ProfileTab() {
    const { t } = useTranslation();
    const { profile, setWeeklyPlan } = useUserStore();
    const [isHomeConfigOpen, setIsHomeConfigOpen] = useState(false);
    const [isProgressOpen, setIsProgressOpen] = useState(false);
    const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false); // Add state

    const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const [, setLocation] = useLocation();

    // ... existing code ...

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                useUserStore.getState().updateProfile({ photo: base64String });
                setIsPhotoMenuOpen(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        if (confirm('Tem certeza? Isso apagará todos os seus dados e progresso.')) {
            localStorage.clear();
            window.location.href = '/';
        }
    };

    const handleRegenerate = () => {
        if (!profile) return;
        const newPlan = generateWeeklyPlan(profile);
        setWeeklyPlan(newPlan);
    };

    if (!profile) return <div className="p-10 text-center">Carregando perfil...</div>;

    return (
        <div className="container" style={{ padding: '20px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--color-surface)' }}>

            {/* Header Section */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '16px',
                marginBottom: '32px'
            }}>
                <div
                    onClick={() => setIsPhotoMenuOpen(true)}
                    style={{
                        position: 'relative',
                        marginBottom: '16px',
                        cursor: 'pointer',
                        zIndex: 1
                    }}>
                    {/* Background Glow */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, var(--color-accent-light) 0%, rgba(255,255,255,0) 70%)',
                        filter: 'blur(45px)',
                        zIndex: -1,
                        pointerEvents: 'none',
                        animation: 'profilePulse 3s infinite ease-in-out'
                    }} />
                    <style>{`
                        @keyframes profilePulse {
                            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
                            50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
                            100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
                        }
                    `}</style>
                    <div style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '50%',
                        background: 'var(--color-surface-alt)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                        fontWeight: 800,
                        color: 'var(--color-text-main)',
                        boxShadow: 'var(--shadow-md)',
                        border: '4px solid var(--color-surface)',
                        overflow: 'hidden'
                    }}>
                        {profile.photo ? (
                            <img
                                src={profile.photo}
                                alt={profile.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            profile.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: '#F59E0B', // Gold/Amber
                        borderRadius: '50%',
                        padding: '6px',
                        border: '3px solid var(--color-surface)',
                        color: 'white',
                        display: 'flex'
                    }}>
                        <Camera size={14} fill="currentColor" />
                    </div>
                </div>

                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: 'var(--color-text-main)',
                    marginBottom: '4px',
                    letterSpacing: '-0.02em'
                }}>
                    {profile.name}
                </h1>
                <p style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                    color: 'var(--color-text-secondary)',
                    marginBottom: '16px'
                }}>
                    {t('profile.member_since')}
                </p>


            </div>

            {/* Main Content Container */}
            <div style={{ maxWidth: '480px', margin: '0 auto' }}>

                {/* Workout Mode Integration (Selector) */}
                <div style={{
                    marginBottom: '24px'
                }}>
                    <WorkoutModeSelector
                        onRegenerate={handleRegenerate}
                        onOpenHomeConfig={() => setIsHomeConfigOpen(true)}
                    />
                </div>

                {/* Navigation Menu */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>

                    {/* INÍCIO */}
                    <MenuItem
                        icon={Home}
                        label={t('profile.home')}
                        onClick={() => setLocation('/app')}
                    />

                    {/* ADAPTAR TREINO EM CASA */}
                    <div>
                        <MenuItem
                            icon={Settings}
                            label={t('profile.home_config')}
                            onClick={() => setIsHomeConfigOpen(!isHomeConfigOpen)}
                            isOpen={isHomeConfigOpen}
                        />

                        <div style={{
                            maxHeight: isHomeConfigOpen ? '600px' : '0',
                            opacity: isHomeConfigOpen ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'max-height 0.4s ease, opacity 0.3s ease',
                            marginBottom: isHomeConfigOpen ? '12px' : '0'
                        }}>
                            {/* Added inner padding/bg if needed, but HomeEquipmentForm has its own style usually */}
                            <HomeEquipmentForm
                                onConfirm={() => {
                                    handleRegenerate();
                                    setIsHomeConfigOpen(false);
                                }}
                                onCancel={() => setIsHomeConfigOpen(false)}
                            />
                        </div>
                    </div>

                    {/* MEU PROGRESSO */}
                    <div>
                        <MenuItem
                            icon={BarChart2}
                            label={t('profile.my_progress')}
                            onClick={() => setIsProgressOpen(!isProgressOpen)}
                            isOpen={isProgressOpen}
                        />

                        <div style={{
                            maxHeight: isProgressOpen ? '500px' : '0',
                            opacity: isProgressOpen ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'max-height 0.4s ease, opacity 0.3s ease',
                            marginBottom: isProgressOpen ? '12px' : '0'
                        }}>
                            <WeightTracker />
                        </div>
                    </div>

                </div>

                {/* Danger Zone */}
                <div style={{ marginTop: '24px' }}>
                    <MenuItem
                        icon={LogOut}
                        label={t('profile.logout')}
                        onClick={handleReset}
                        showChevron={false}
                        isDanger={true}
                    />
                </div>

                {/* Privacy Policy */}
                <div style={{ marginTop: '12px' }}>
                    <MenuItem
                        icon={Shield}
                        label="Política de Privacidade"
                        onClick={() => setLocation('/app/privacy')}
                    />
                </div>

                {/* Restore Purchases */}
                <div style={{ marginTop: '12px' }}>
                    <MenuItem
                        icon={RefreshCw}
                        label="Restaurar Compras"
                        onClick={async () => {
                            try {
                                const restored = await billingService.restorePurchases();
                                if (restored) {
                                    useUserStore.getState().setPremium(true);
                                    useCoachStore.getState().activatePremium();
                                    alert("Assinatura restaurada com sucesso!");
                                } else {
                                    alert("Nenhuma assinatura ativa encontrada.");
                                }
                            } catch (e) {
                                console.error(e);
                                alert("Erro ao restaurar compras.");
                            }
                        }}
                    />
                </div>



                {/* Premium CTA */}
                <button onClick={() => setIsSubscriptionOpen(true)} style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', // Dark consistent theme premium
                    color: 'white',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                    border: 'none',
                    marginTop: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <Crown size={20} fill="#F59E0B" color="#F59E0B" />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('profile.be_pro')}</span>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>{t('profile.unlock_all')}</span>
                    </div>
                </button>

                <p style={{
                    textAlign: 'center',
                    fontSize: '10px',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '16px',
                    marginTop: '24px',
                    fontWeight: 600,
                    opacity: 0.5
                }}>
                    {t('profile.version')} 2.5.0
                </p>
            </div>

            {/* Photo Selection Modal */}
            {isPhotoMenuOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                }} onClick={() => setIsPhotoMenuOpen(false)}>
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        width: '100%',
                        maxWidth: '480px',
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        padding: '24px',
                        animation: 'slideUp 0.3s ease-out'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Alterar Foto</h3>
                            <button onClick={() => setIsPhotoMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <button
                                onClick={() => cameraInputRef.current?.click()}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    backgroundColor: 'var(--color-surface-alt)',
                                    cursor: 'pointer'
                                }}>
                                <div style={{
                                    padding: '16px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white'
                                }}>
                                    <Camera size={32} />
                                </div>
                                <span style={{ fontWeight: 600, fontSize: '14px' }}>Câmera</span>
                            </button>

                            <button
                                onClick={() => galleryInputRef.current?.click()}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    backgroundColor: 'var(--color-surface-alt)',
                                    cursor: 'pointer'
                                }}>
                                <div style={{
                                    padding: '16px',
                                    borderRadius: '50%',
                                    backgroundColor: '#10B981',
                                    color: 'white'
                                }}>
                                    <ImageIcon size={32} />
                                </div>
                                <span style={{ fontWeight: 600, fontSize: '14px' }}>Galeria</span>
                            </button>
                        </div>

                        {/* Hidden Inputs */}
                        <input
                            type="file"
                            ref={cameraInputRef}
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <input
                            type="file"
                            ref={galleryInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            )}

            {/* Subscription View Modal */}
            {isSubscriptionOpen && (
                <SubscriptionView onClose={() => setIsSubscriptionOpen(false)} />
            )}
        </div>
    );
}