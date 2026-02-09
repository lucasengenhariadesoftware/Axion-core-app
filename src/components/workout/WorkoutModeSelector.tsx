import React from 'react';
import { Settings2, Dumbbell, Home, AlertCircle } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

interface WorkoutModeSelectorProps {
    onOpenHomeConfig: () => void;
    onRegenerate: () => void;
}

export const WorkoutModeSelector: React.FC<WorkoutModeSelectorProps> = ({
    onOpenHomeConfig,
    onRegenerate
}) => {
    const { profile, updateProfile } = useUserStore();
    const mode = profile?.workoutMode || 'gym';
    const isHomeConfigured = profile?.homeEquipment && profile.homeEquipment.length > 0;

    const handleSelect = (newMode: 'gym' | 'home') => {
        if (mode !== newMode) {
            updateProfile({ workoutMode: newMode });
            onRegenerate();
        }
        // If switching to home and not configured, open config
        if (newMode === 'home' && !isHomeConfigured) {
            onOpenHomeConfig();
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {/* Header / Title if needed, usually just the toggle is enough based on context */}

            <div style={{
                position: 'relative',
                width: '100%',
                height: '72px',
                background: mode === 'gym'
                    ? 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)' // Blue gradient (Gym)
                    : 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)', // Green gradient (Home)
                borderRadius: '16px', // Rounded corners as per card style or 'full' for pill? User image shows rounded rect.
                padding: '4px',
                display: 'flex',
                cursor: 'pointer',
                transition: 'background 0.4s ease',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}>
                {/* Animated Thumb */}
                <div style={{
                    position: 'absolute',
                    top: '4px',
                    bottom: '4px',
                    left: mode === 'home' ? '4px' : '50%',
                    width: 'calc(50% - 4px)',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', // Bounce effect
                    zIndex: 1
                }} />

                {/* Left Option: Home */}
                <div
                    onClick={() => handleSelect('home')}
                    style={{
                        flex: 1,
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: mode === 'home' ? 1 : 0.6,
                        transition: 'opacity 0.3s',
                        color: mode === 'home' ? '#14532D' : '#475569' // Green-900 or Slate-600
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <Home size={18} strokeWidth={2.5} />
                        <span style={{ fontWeight: 800, fontSize: '14px', textTransform: 'uppercase' }}>Casa</span>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600 }}>Adaptado</span>

                    {/* Config Badge for Home */}

                </div>

                {/* Right Option: Gym */}
                <div
                    onClick={() => handleSelect('gym')}
                    style={{
                        flex: 1,
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: mode === 'gym' ? 1 : 0.6,
                        transition: 'opacity 0.3s',
                        color: mode === 'gym' ? '#0369A1' : '#475569' // Blue-700 or Slate-600
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <Dumbbell size={18} strokeWidth={2.5} />
                        <span style={{ fontWeight: 800, fontSize: '14px', textTransform: 'uppercase' }}>Academia</span>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600 }}>Completo</span>
                </div>
            </div>

            {/* Hint/Description below if needed for "Configurar" when NOT active? 
                 User request: "Se 'Casa' for selecionado e ainda não configurado, mostrar badge 'Configurar' que abre modal ao clicar."
                 I handled this inside the toggle.
             */}
        </div>
    );
};