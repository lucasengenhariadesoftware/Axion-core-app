
import { Card } from './Card';
import { Button } from './Button';
import { Bell, Check } from 'lucide-react';

interface AlarmModalProps {
    title: string;
    time: string;
    onDismiss: () => void;
}

export default function AlarmModal({ title, time, onDismiss }: AlarmModalProps) {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px'
        }}>
            <div className="animate-bounce-in">
                <Card style={{
                    padding: '32px', textAlign: 'center', width: '100%', maxWidth: '320px',
                    background: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}>
                    <div style={{
                        width: '64px', height: '64px', margin: '0 auto 20px auto',
                        background: '#ECFDF5', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#10B981', boxShadow: '0 0 0 8px #F0FDF4'
                    }}>
                        <Bell size={32} className="animate-ring" />
                    </div>

                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1F2937', marginBottom: '8px' }}>
                        {time}
                    </h2>
                    <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '8px' }}>
                        Hora da sua atividade:
                    </p>
                    <p style={{ fontSize: '18px', fontWeight: 600, color: '#4F46E5', marginBottom: '32px' }}>
                        {title}
                    </p>

                    <Button
                        onClick={onDismiss}
                        style={{ width: '100%', borderRadius: '16px', padding: '16px', fontSize: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}
                    >
                        <Check size={20} />
                        Estou ciente
                    </Button>
                </Card>
            </div>
            <style>{`
                @keyframes ring {
                    0% { transform: rotate(0); }
                    10% { transform: rotate(15deg); }
                    20% { transform: rotate(-15deg); }
                    30% { transform: rotate(10deg); }
                    40% { transform: rotate(-10deg); }
                    50% { transform: rotate(0); }
                    100% { transform: rotate(0); }
                }
                .animate-ring { animation: ring 1.5s infinite; }
                .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes bounce-in {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
