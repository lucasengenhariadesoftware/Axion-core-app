import React from 'react';
import { CoachHeader } from '../../components/coach/CoachHeader';
import { ChatInterface } from '../../components/coach/ChatInterface';


export default function CoachTab() {
    return (
        <div style={{
            height: '100%',
            minHeight: '100vh',
            background: 'var(--color-surface-bg)',
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '-20px'
        }}>

            {/* Header stays at the top */}
            <CoachHeader />

            {/* Main scrollable content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Chat Section */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <ChatInterface />
                </div>
            </div>

        </div>
    );
}
