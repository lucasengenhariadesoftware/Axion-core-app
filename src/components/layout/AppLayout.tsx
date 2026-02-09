import React from 'react';
import { BottomNav } from './BottomNav';
import { useUserStore } from '../../store/userStore';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isPremium } = useUserStore();
    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-surface)',
            position: 'relative'
        }}>
            <main style={{ paddingBottom: isPremium ? '110px' : '160px', transition: 'padding-bottom 0.3s ease' }}>
                {children}
            </main>
            <BottomNav />
        </div>
    );
};
