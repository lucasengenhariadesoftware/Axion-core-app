import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Save, Trash2, Clock, MapPin, Flame, Activity } from 'lucide-react';
import { useRunStore } from '../../store/runStore';
import { formatTime } from '../../lib/runLogic';

export default function RunSummary() {
    const { currentRun, saveRun, discardRun } = useRunStore();

    if (!currentRun) return null; // Should not happen

    const pathPositions: [number, number][] = currentRun.path.map(p => [p.lat, p.lng]);
    const center: [number, number] = pathPositions.length > 0 ? pathPositions[pathPositions.length - 1] : [-23.5505, -46.6333];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F9FAFB', overflowY: 'auto' }}>
            {/* Map Summary */}
            <div style={{ height: '35vh', width: '100%', position: 'relative' }}>
                <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false} attributionControl={false}>
                    <TileLayer
                        attribution='&copy; Google'
                        url="http://mt0.google.com/vt/lyrs=m&hl=pt-BR&x={x}&y={y}&z={z}"
                    />
                    <Polyline positions={pathPositions} pathOptions={{ color: '#F97316', weight: 5 }} />
                </MapContainer>
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                    height: '60px', pointerEvents: 'none'
                }} />
            </div>

            {/* Content */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>Corrida Finalizada</h2>
                    <p style={{ color: '#6B7280' }}>
                        {new Date(currentRun.startTime).toLocaleDateString()} às {new Date(currentRun.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#6B7280' }}>
                            <MapPin size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>DISTÂNCIA</span>
                        </div>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{(currentRun.distance / 1000).toFixed(2)}<span style={{ fontSize: '0.9rem' }}> km</span></p>
                    </div>

                    <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#6B7280' }}>
                            <Clock size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>TEMPO</span>
                        </div>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{formatTime(currentRun.duration)}</p>
                    </div>

                    <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#6B7280' }}>
                            <Flame size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>CALORIAS</span>
                        </div>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{currentRun.calories.toFixed(0)}<span style={{ fontSize: '0.9rem' }}> kcal</span></p>
                        <p style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '4px' }}>*Estimativa</p>
                    </div>

                    <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#6B7280' }}>
                            <Activity size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>RITMO MÉDIO</span>
                        </div>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
                            {Math.floor(currentRun.pace)}'{Math.floor((currentRun.pace % 1) * 60)}''<span style={{ fontSize: '0.9rem' }}> /km</span>
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        onClick={saveRun}
                        style={{
                            width: '100%',
                            background: '#10B981',
                            color: 'white',
                            padding: '16px',
                            borderRadius: '16px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        <Save size={20} />
                        SALVAR ATIVIDADE
                    </button>

                    <button
                        onClick={discardRun}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            color: '#EF4444',
                            padding: '16px',
                            borderRadius: '16px',
                            border: '1px solid #FEE2E2',
                            fontSize: '1rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        <Trash2 size={20} />
                        Descartar
                    </button>
                </div>
            </div>
        </div>
    );
}
