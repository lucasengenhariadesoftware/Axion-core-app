import React, { useState, useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { useUserStore } from '../../store/userStore';
import { AdManager } from '../../services/AdManager';
import { Device } from '@capacitor/device';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isPremium } = useUserStore();
    const [isAndroid, setIsAndroid] = useState(false);

    useEffect(() => {
        const checkDevice = async () => {
            try {
                const info = await Device.getInfo();
                setIsAndroid(info.operatingSystem === 'android');
            } catch (e) {
                console.error("Failed to get device info", e);
            }
        };
        checkDevice();
    }, []);

    const NAV_HEIGHT = 88;
    const bottomOverlayHeight = AdManager.getBottomOffset(isPremium, isAndroid);
    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-surface)',
            position: 'relative'
        }}>
            <main style={{ paddingBottom: `${NAV_HEIGHT + bottomOverlayHeight}px`, transition: 'padding-bottom 0.3s ease' }}>
                {children}
            </main>
            <BottomNav />
        </div>
    );
};


