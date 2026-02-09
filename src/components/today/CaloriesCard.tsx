import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { useUserStore } from '../../store/userStore';
import { Flame } from 'lucide-react';

export default function CaloriesCard() {
    const { dailyPlan } = useUserStore();

    const data = useMemo(() => {
        if (!dailyPlan) return null;

        let totalCalories = 0;
        let consumedCalories = 0;
        let totalProtein = 0;
        let consumedProtein = 0;
        let totalCarbs = 0;
        let consumedCarbs = 0;
        let totalFat = 0;
        let consumedFat = 0;

        const mealsData = dailyPlan.meals.map(meal => {
            const mealCalories = meal.items?.reduce((acc, item) => acc + item.calories, 0) || meal.calories || 0;
            const mealProtein = meal.items?.reduce((acc, item) => acc + item.macros.protein, 0) || 0;
            const mealCarbs = meal.items?.reduce((acc, item) => acc + item.macros.carbs, 0) || 0;
            const mealFat = meal.items?.reduce((acc, item) => acc + item.macros.fat, 0) || 0;

            totalCalories += mealCalories;
            totalProtein += mealProtein;
            totalCarbs += mealCarbs;
            totalFat += mealFat;

            if (meal.done) {
                consumedCalories += mealCalories;
                consumedProtein += mealProtein;
                consumedCarbs += mealCarbs;
                consumedFat += mealFat;
            }

            return {
                name: meal.name,
                shortName: meal.name.split(' ')[0], // "Café", "Almoço"
                calories: mealCalories,
                isDone: meal.done
            };
        });

        return {
            totalCalories,
            consumedCalories,
            remainingCalories: Math.max(0, totalCalories - consumedCalories),
            macros: {
                protein: { total: totalProtein, consumed: consumedProtein },
                carbs: { total: totalCarbs, consumed: consumedCarbs },
                fat: { total: totalFat, consumed: consumedFat }
            },
            mealsData
        };
    }, [dailyPlan]);

    if (!data) return null;

    const pieData = [
        { name: 'Consuimdo', value: data.consumedCalories },
        { name: 'Restante', value: data.remainingCalories }
    ];

    const COLORS = ['#10B981', '#E5E7EB']; // Green for done, Gray for remaining

    return (
        <Card style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Metas Diárias</h2>
                    <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Visão geral da sua nutrição</p>
                </div>
                <div style={{
                    background: '#FEF3C7', color: '#D97706', padding: '6px 12px', borderRadius: '20px',
                    fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px',
                    whiteSpace: 'nowrap', flexShrink: 0
                }}>
                    <Flame size={14} fill="#D97706" />
                    {Math.round(data.consumedCalories)} / {Math.round(data.totalCalories)} kcal
                </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '24px', alignItems: 'center', justifyContent: 'center' }}>
                {/* Circular Progress */}
                <div style={{ position: 'relative', height: '140px', width: '140px', flexShrink: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={60}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={10}
                                paddingAngle={2}
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#111827' }}>
                            {Math.round((data.consumedCalories / data.totalCalories) * 100)}%
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>DA META</div>
                    </div>
                </div>

                {/* Macro Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px', flex: 1, minWidth: '180px' }}>
                    <MacroBar label="Proteína" current={data.macros.protein.consumed} total={data.macros.protein.total} color="#3B82F6" />
                    <MacroBar label="Carboidratos" current={data.macros.carbs.consumed} total={data.macros.carbs.total} color="#F59E0B" />
                    <MacroBar label="Gorduras" current={data.macros.fat.consumed} total={data.macros.fat.total} color="#EF4444" />
                </div>
            </div>

            {/* Meals Chart */}
            <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#374151' }}>
                    Distribuição por Refeição
                </h3>
                <div style={{ height: '180px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.mealsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <XAxis
                                dataKey="shortName"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#6B7280' }}
                                dy={10}
                            />
                            <YAxis
                                hide
                            />
                            <Tooltip
                                cursor={{ fill: '#F3F4F6', radius: 4 }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                            />
                            <Bar
                                dataKey="calories"
                                radius={[4, 4, 4, 4]}
                                barSize={20}
                            >
                                {data.mealsData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.isDone ? '#10B981' : '#E5E7EB'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Legend/Info */}
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10B981' }} />
                        Consumido
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#E5E7EB' }} />
                        Planejado
                    </div>
                </div>
            </div>
        </Card>
    );
}

function MacroBar({ label, current, total, color }: { label: string, current: number, total: number, color: string }) {
    const percent = Math.min(100, Math.round((current / total) * 100));
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{label}</span>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>{Math.round(current)}/{Math.round(total)}g</span>
            </div>
            <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percent}%`, background: color, borderRadius: '99px', transition: 'width 0.5s ease' }} />
            </div>
        </div>
    );
}
