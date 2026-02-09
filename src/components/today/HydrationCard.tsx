
import { useMemo } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useUserStore } from '../../store/userStore';
import { Droplets, Plus, Minus } from 'lucide-react';

export default function HydrationCard() {
    const { waterIntake, dailyPlan, addWater } = useUserStore();

    const target = dailyPlan?.meta?.waterTarget || 2500;
    const percentage = Math.min(100, Math.round((waterIntake / target) * 100));

    // Data for the Radial Bar Chart
    const data = useMemo(() => [
        {
            name: 'Target',
            value: 100,
            fill: '#E0F2FE'
        },
        {
            name: 'Intake',
            value: percentage,
            fill: '#0EA5E9'
        }
    ], [percentage]);

    return (
        <Card style={{ padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
            {/* Background Decoration */}
            <div style={{
                position: 'absolute', top: -20, right: -20,
                width: '100px', height: '100px', borderRadius: '50%',
                background: 'rgba(14, 165, 233, 0.05)', zIndex: 0
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0C4A6E' }}>Hidratação</h2>
                    <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Meta: {target}ml</p>
                </div>
                <div style={{
                    background: '#F0F9FF', color: '#0284C7', padding: '6px 12px', borderRadius: '20px',
                    fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                    <Droplets size={14} fill="#0284C7" />
                    {waterIntake}ml
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center' }}>
                {/* Chart Section */}
                <div style={{ height: '160px', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            innerRadius="70%"
                            outerRadius="100%"
                            data={data}
                            startAngle={180}
                            endAngle={0}
                            barSize={15}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar background dataKey="value" cornerRadius={10} />
                        </RadialBarChart>
                    </ResponsiveContainer>

                    {/* Overlay the actual progress chart on top to create the track effect properly */}
                    <div style={{ position: 'absolute', inset: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="70%"
                                outerRadius="100%"
                                data={[{ value: percentage, fill: '#0EA5E9' }]}
                                startAngle={180}
                                endAngle={0}
                                barSize={15}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar dataKey="value" cornerRadius={10} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={{
                        position: 'absolute', top: '65%', left: '50%', transform: 'translate(-50%, -50%)',
                        textAlign: 'center', width: '100%'
                    }}>
                        <div style={{ fontSize: '32px', fontWeight: 800, color: '#0C4A6E', lineHeight: 1 }}>
                            {percentage}%
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>DA META</div>
                    </div>
                </div>

                {/* Controls Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Button
                        size="sm"
                        onClick={() => addWater(250)}
                        className="active-scale"
                        style={{
                            background: 'white', color: '#0284C7', border: '1px solid #BAE6FD',
                            boxShadow: '0 2px 4px rgba(14, 165, 233, 0.05)',
                            height: '46px', justifyContent: 'flex-start', paddingLeft: '16px'
                        }}
                    >
                        <div style={{ background: '#E0F2FE', padding: '4px', borderRadius: '50%', marginRight: '8px' }}>
                            <Plus size={14} />
                        </div>
                        <span style={{ fontWeight: 600 }}>Copo (250ml)</span>
                    </Button>

                    <Button
                        size="sm"
                        onClick={() => addWater(500)}
                        className="active-scale"
                        style={{
                            background: 'white', color: '#0369A1', border: '1px solid #7DD3FC',
                            boxShadow: '0 2px 4px rgba(14, 165, 233, 0.1)',
                            height: '46px', justifyContent: 'flex-start', paddingLeft: '16px'
                        }}
                    >
                        <div style={{ background: '#BAE6FD', padding: '4px', borderRadius: '50%', marginRight: '8px' }}>
                            <Plus size={14} />
                        </div>
                        <span style={{ fontWeight: 600 }}>Garrafa (500ml)</span>
                    </Button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => addWater(-250)}
                            style={{
                                background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '12px',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                                padding: '4px'
                            }}
                        >
                            <Minus size={12} /> Corrigir
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
