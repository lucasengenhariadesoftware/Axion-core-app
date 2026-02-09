
import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Briefcase, GraduationCap, Dumbbell, Calendar, Trash2, ArrowRight, Bell, BellOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useUserStore } from '../../store/userStore';
import { RoutineItem } from '../../types/diet';

export default function RoutineSetupCard() {
    const [isOpen, setIsOpen] = useState(false);
    const { addRoutineItem, dailyPlan, removeRoutineItem } = useUserStore();

    // Form State
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'work' | 'study' | 'training' | 'other'>('work');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('17:00');
    const [alarmEnabled, setAlarmEnabled] = useState(false);

    const handleAdd = () => {
        if (!title.trim()) return;

        const newItem: RoutineItem = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            type,
            startTime,
            endTime,
            completed: false,
            alarmEnabled
        };

        // @ts-ignore
        addRoutineItem(newItem);

        // Reset form
        setTitle('');
        // Keep last times as convenience or reset? Let's keep type reset but maybe time is useful to flow
        setType('work');
    };

    const getTypeIcon = (t: string, active: boolean) => {
        const color = active ? 'white' : '#6B7280';
        switch (t) {
            case 'work': return <Briefcase size={18} color={color} />;
            case 'study': return <GraduationCap size={18} color={color} />;
            case 'training': return <Dumbbell size={18} color={color} />;
            default: return <Calendar size={18} color={color} />;
        }
    };

    const addedItems = dailyPlan?.routineItems || [];

    return (
        <Card style={{ marginBottom: '24px', overflow: 'hidden', padding: 0, border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)' }}>
            {/* Header with Gradient */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '20px 24px',
                    background: isOpen ? 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)' : 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        background: isOpen ? 'rgba(255,255,255,0.2)' : '#F3F4F6',
                        padding: '10px',
                        borderRadius: '14px',
                        backdropFilter: isOpen ? 'blur(10px)' : 'none',
                        transition: 'all 0.3s'
                    }}>
                        <Calendar size={22} color={isOpen ? 'white' : '#4B5563'} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: isOpen ? 'white' : '#1F2937' }}>Programar Horários</h3>
                        <p style={{ fontSize: '13px', color: isOpen ? 'rgba(255,255,255,0.8)' : '#6B7280', margin: '2px 0 0 0' }}>
                            {isOpen ? 'Adicionar novos compromissos' : `${addedItems.length} atividades marcadas`}
                        </p>
                    </div>
                </div>
                <div style={{
                    background: isOpen ? 'rgba(255,255,255,0.2)' : 'transparent',
                    borderRadius: '50%',
                    padding: '4px',
                    transition: 'all 0.3s'
                }}>
                    {isOpen ? <ChevronUp size={20} color="white" /> : <ChevronDown size={20} color="#9CA3AF" />}
                </div>
            </div>

            <div style={{
                maxHeight: isOpen ? '600px' : '0',
                opacity: isOpen ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden',
                background: 'white'
            }}>
                <div style={{ padding: '24px' }}>
                    {/* Activity Type Selector */}
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '12px', letterSpacing: '0.05em' }}>TIPO DE ATIVIDADE</p>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                        {(['work', 'study', 'training', 'other'] as const).map((t) => {
                            const isActive = type === t;
                            let activeColor = '#4F46E5';
                            if (t === 'study') activeColor = '#8B5CF6';
                            if (t === 'training') activeColor = '#EC4899';
                            if (t === 'other') activeColor = '#F59E0B';

                            return (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '12px',
                                        border: isActive ? `none` : '1px solid #E5E7EB',
                                        background: isActive ? activeColor : 'white',
                                        color: isActive ? 'white' : '#6B7280',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        boxShadow: isActive ? `0 4px 12px ${activeColor}50` : 'none',
                                        transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                        transform: isActive ? 'scale(1.02)' : 'scale(1)'
                                    }}
                                >
                                    {getTypeIcon(t, isActive)}
                                    {t === 'work' ? 'Trabalho' : t === 'study' ? 'Estudo' : t === 'training' ? 'Treino' : 'Outro'}
                                </button>
                            );
                        })}
                    </div>

                    {/* Inputs */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Nome da Atividade"
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        paddingLeft: '16px',
                                        borderRadius: '16px',
                                        background: '#F9FAFB',
                                        border: '1px solid transparent',
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        color: '#1F2937'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.background = 'white';
                                        e.target.style.border = '1px solid #4F46E5';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.background = '#F9FAFB';
                                        e.target.style.border = '1px solid transparent';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => setAlarmEnabled(!alarmEnabled)}
                                style={{
                                    padding: '16px',
                                    borderRadius: '16px',
                                    background: alarmEnabled ? '#ECFDF5' : '#F9FAFB',
                                    border: alarmEnabled ? '1px solid #10B981' : '1px solid transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: alarmEnabled ? '#059669' : '#9CA3AF',
                                    transition: 'all 0.2s',
                                    minWidth: '56px'
                                }}
                            >
                                {alarmEnabled ? <Bell size={20} fill="#059669" /> : <BellOff size={20} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', marginBottom: '6px', textTransform: 'uppercase' }}>Início</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px 12px 12px 40px', borderRadius: '14px',
                                        background: '#F9FAFB', border: '1px solid #E5E7EB', fontSize: '15px', fontWeight: 600, outline: 'none',
                                        color: '#374151', fontFamily: 'monospace'
                                    }}
                                />
                                <Clock size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', marginBottom: '6px', textTransform: 'uppercase' }}>Fim</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px 12px 12px 40px', borderRadius: '14px',
                                        background: '#F9FAFB', border: '1px solid #E5E7EB', fontSize: '15px', fontWeight: 600, outline: 'none',
                                        color: '#374151', fontFamily: 'monospace'
                                    }}
                                />
                                <Clock size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleAdd}
                        disabled={!title.trim()}
                        className="active-scale"
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px',
                            background: title.trim() ? '#111827' : '#E5E7EB',
                            color: title.trim() ? 'white' : '#9CA3AF',
                            padding: '16px',
                            borderRadius: '16px',
                            fontSize: '16px',
                            fontWeight: 600,
                            boxShadow: title.trim() ? '0 10px 20px -5px rgba(0,0,0,0.2)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Adicionar à Rotina
                        {title.trim() && <ArrowRight size={18} />}
                    </Button>

                    {/* Quick Preview List */}
                    {addedItems.length > 0 && (
                        <div style={{ marginTop: '32px' }}>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF', marginBottom: '16px', letterSpacing: '0.05em', borderTop: '1px solid #F3F4F6', paddingTop: '24px' }}>ITENS ADICIONADOS</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {addedItems.map((item) => (
                                    <div key={item.id} className="animate-fade-in" style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '12px 16px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid transparent'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '10px',
                                                background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                            }}>
                                                {getTypeIcon(item.type, false)}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>{item.title}</div>
                                                <div style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    {item.startTime} <ArrowRight size={10} /> {item.endTime}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            // @ts-ignore
                                            onClick={() => removeRoutineItem(item.id)}
                                            style={{
                                                width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'white',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#EF4444', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
