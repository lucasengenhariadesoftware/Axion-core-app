import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useDietStore } from '../../store/dietStore';

export default function ShoppingList() {
    const plan = useDietStore(state => state.currentPlan);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    if (!plan) return null;

    // Aggregate items by name to avoid duplicates
    const aggregatedList: Record<string, { count: number, portion: string, category: string }> = {};

    plan.meals.forEach(meal => {
        meal.items.forEach(item => {
            if (!aggregatedList[item.name]) {
                aggregatedList[item.name] = { count: 0, portion: item.portion, category: item.category };
            }
            aggregatedList[item.name].count += 1;
        });
    });

    const categories = {
        protein: 'Açougue & Proteínas',
        carb: 'Mercearia & Grãos',
        veg: 'Hortifruti',
        fruit: 'Hortifruti',
        fat: 'Óleos & Castanhas',
        dairy: 'Laticínios'
    };

    const toggleCheck = (name: string) => {
        setCheckedItems(prev => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <div style={{ padding: '24px', background: '#F9FAFB', borderRadius: '24px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <ShoppingBag size={24} color="#10B981" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>Lista de Compras</h2>
            </div>

            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '24px' }}>
                Baseada no cardápio de hoje ({new Date().toLocaleDateString()}).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {Object.entries(categories).map(([catKey, catLabel]) => {
                    const items = Object.entries(aggregatedList).filter(([_, data]) => data.category === catKey);

                    if (items.length === 0) return null;

                    return (
                        <div key={catKey}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                                {catLabel}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {items.map(([name, data]) => (
                                    <div
                                        key={name}
                                        onClick={() => toggleCheck(name)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '12px', background: 'white', borderRadius: '12px',
                                            cursor: 'pointer',
                                            opacity: checkedItems[name] ? 0.6 : 1,
                                            textDecoration: checkedItems[name] ? 'line-through' : 'none'
                                        }}
                                    >
                                        <div style={{
                                            width: '20px', height: '20px', borderRadius: '6px', border: '2px solid #E5E7EB',
                                            background: checkedItems[name] ? '#10B981' : 'transparent',
                                            borderColor: checkedItems[name] ? '#10B981' : '#E5E7EB',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {checkedItems[name] && <Check size={12} color="white" strokeWidth={4} />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#374151' }}>{name}</span>
                                            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{data.portion} (x{data.count})</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
