import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { AdManager } from '../../services/AdManager';
import { NAV_ITEMS } from '../../config/navigation';
import { useUserStore } from '../../store/userStore';

export const BottomNav = () => {
    const { t } = useTranslation();
    const [location, setLocation] = useLocation();
    const { isPremium } = useUserStore();

    useEffect(() => {
        if (isPremium) {
            AdManager.hideBanner();
        } else {
            AdManager.showBanner();
        }
        return () => {
            AdManager.hideBanner();
        };
    }, [isPremium]);

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between', // Distribute evenly
            padding: isPremium ? '8px 4px 4px 4px' : '8px 4px 24px 4px', /* Reduced bottom padding for Premium */
            zIndex: 50,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.02)',
            marginBottom: isPremium ? '0' : '50px', // Adjusted for AdMob Banner
            transition: 'margin-bottom 0.3s ease' // Smooth transition when upgrading
        }}>
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                // Check if active. Logic handles sub-routes too if needed, but for tabs exact match is better or prefix
                const isActive = location === item.path;

                return (
                    <button
                        key={item.id}
                        onClick={async () => {
                            await AdManager.showInterstitial();
                            setLocation(item.path);
                        }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flex: 1, // Allow items to share width
                            gap: '0px',
                            padding: '8px 2px', // Reduced horizontal padding
                            minWidth: 0, // Allow shrinking
                            color: isActive ? 'var(--color-primary)' : '#94a3b8',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            WebkitTapHighlightColor: 'transparent',
                        }}
                    >
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            transform: isActive ? 'translateY(-4px) scale(1.1)' : 'none',
                        }}>
                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 2}
                                fill={isActive ? 'currentColor' : 'none'}
                                fillOpacity={0.1}
                            />
                        </div>
                        <span style={{
                            fontSize: '11px', // Increased again per request
                            letterSpacing: '-0.3px', // Tighten more to fit
                            fontWeight: isActive ? 700 : 500,
                            marginTop: '4px',
                            transition: 'all 0.3s ease',
                            opacity: isActive ? 1 : 0.8,
                            transform: isActive ? 'scale(1)' : 'scale(0.95)'
                        }}>
                            {t(item.label)}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
