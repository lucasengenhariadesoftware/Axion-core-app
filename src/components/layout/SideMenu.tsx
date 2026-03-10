import React, { useState } from 'react';
import { Music2, ChevronDown, ChevronUp, PlayCircle, Flame } from 'lucide-react';
import { MusicPlayer } from '../music/MusicPlayer';
import { AdManager } from '../../services/AdManager';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
    const [isMusicUnlocked, setIsMusicUnlocked] = useState(false);
    const [isWatchingAd, setIsWatchingAd] = useState(false);

    // Initial check on mount/open
    React.useEffect(() => {
        if (isOpen) {
            setIsMusicUnlocked(AdManager.isMusicFeatureUnlocked());
        }
    }, [isOpen]);

    const handleUnlockClick = async () => {
        setIsWatchingAd(true);
        const rewardEarned = await AdManager.showRewardAd();
        setIsWatchingAd(false);

        if (rewardEarned) {
            AdManager.unlockMusicFeatureFor24Hours();
            setIsMusicUnlocked(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            display: 'flex',
            visibility: isOpen ? 'visible' : 'hidden'
        }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    opacity: isOpen ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                }}
            />

            {/* Menu Content */}
            <div style={{
                position: 'relative',
                width: '80%',
                maxWidth: '320px',
                height: '100%',
                backgroundColor: 'white',
                boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 10000
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #f3f4f6'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Suas Músicas</h2>
                </div>

                {/* Content Scroll */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

                    {/* Music Section */}
                    <div style={{ marginBottom: '16px', position: 'relative' }}>
                        {/* Always show the music player, no more accordion */}
                        <div style={{
                            padding: '4px',
                            animation: 'fadeIn 0.3s ease-in-out',
                            filter: !isMusicUnlocked ? 'blur(8px) grayscale(0.5)' : 'none',
                            pointerEvents: !isMusicUnlocked ? 'none' : 'auto',
                            userSelect: !isMusicUnlocked ? 'none' : 'auto',
                            transition: 'all 0.3s ease'
                        }}>
                            <MusicPlayer />
                        </div>

                        {/* Locker Overlay */}
                        {!isMusicUnlocked && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                zIndex: 10,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                paddingTop: '24px',
                                paddingBottom: '24px',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                textAlign: 'center',
                                background: 'rgba(255, 255, 255, 0.4)'
                            }}>
                                <div style={{
                                    background: 'white',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    maxWidth: '280px',
                                    animation: 'bounceIn 0.5s ease'
                                }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '50%', background: '#FEE2E2',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
                                    }}>
                                        <Music2 size={24} color="#EF4444" />
                                    </div>

                                    <div>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                                            Música Premium
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: 1.5 }}>
                                            Para ouvir suas músicas treinando hoje, assista a um anúncio para liberar por 24 horas.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleUnlockClick}
                                        disabled={isWatchingAd}
                                        style={{
                                            padding: '12px',
                                            background: '#4F46E5',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            cursor: isWatchingAd ? 'wait' : 'pointer',
                                            opacity: isWatchingAd ? 0.7 : 1,
                                            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                                        }}
                                    >
                                        {isWatchingAd ? 'Carregando...' : 'Desbloquear Músicas'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
