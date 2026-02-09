import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import { Pause, Play, Square } from 'lucide-react';
import { useRunStore } from '../../store/runStore';
import { runService } from '../../lib/runService';
import { formatTime, formatPace } from '../../lib/runLogic';

// Helper to center map on user
function MapRecenter({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.panTo(position);
    }, [position, map]);
    return null;
}

export default function RunTracker() {
    const {
        currentRun, status,
        pauseRun, resumeRun, stopRun, tickTimer
    } = useRunStore();

    useEffect(() => {
        const interval = setInterval(() => {
            if (status === 'running') tickTimer();
        }, 1000);
        return () => clearInterval(interval);
    }, [status, tickTimer]);

    useEffect(() => {
        runService.startTracking();
        return () => runService.stopTracking();
    }, []);

    if (!currentRun) return null;

    const currentPos = currentRun.path.length > 0
        ? currentRun.path[currentRun.path.length - 1]
        : null;

    const center: [number, number] = currentPos ? [currentPos.lat, currentPos.lng] : [-23.5505, -46.6333];
    const pathPositions: [number, number][] = currentRun.path.map(p => [p.lat, p.lng]);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Live Map */}
            <div style={{ flex: 1 }}>
                <MapContainer center={center} zoom={16} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                    <TileLayer
                        attribution='&copy; Google'
                        url="http://mt0.google.com/vt/lyrs=m&hl=pt-BR&x={x}&y={y}&z={z}"
                    />
                    <Polyline positions={pathPositions} pathOptions={{ color: '#F97316', weight: 5 }} />
                    {currentPos && <Marker position={[currentPos.lat, currentPos.lng]} />}
                    {currentPos && <MapRecenter position={[currentPos.lat, currentPos.lng]} />}
                </MapContainer>
            </div>

            {/* Stats Overlay - Top */}
            <div style={{
                position: 'absolute', top: 20, left: 20, right: 20,
                zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(5px)'
                }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', fontFamily: 'monospace' }}>
                        {formatTime(currentRun.duration)}
                    </span>
                </div>
            </div>

            {/* Controls & Stats - Bottom */}
            <div style={{ background: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)', zIndex: 1001 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.85rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Distância</p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>
                            {(currentRun.distance / 1000).toFixed(2)} <span style={{ fontSize: '1rem', color: '#9CA3AF' }}>km</span>
                        </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.85rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Ritmo</p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>
                            {formatPace(currentRun.pace)} <span style={{ fontSize: '1rem', color: '#9CA3AF' }}>/km</span>
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    {status === 'running' ? (
                        <button
                            onClick={pauseRun}
                            style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                background: '#F59E0B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 6px rgba(245, 158, 11, 0.4)'
                            }}
                        >
                            <Pause fill="currentColor" size={28} />
                        </button>
                    ) : (
                        <button
                            onClick={resumeRun}
                            style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 6px rgba(16, 185, 129, 0.4)'
                            }}
                        >
                            <Play fill="currentColor" size={28} />
                        </button>
                    )}

                    <button
                        onClick={() => {
                            if (window.confirm("Deseja finalizar a corrida?")) {
                                stopRun();
                            }
                        }}
                        style={{
                            width: '64px', height: '64px', borderRadius: '50%',
                            background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 6px rgba(16, 185, 129, 0.4)'
                        }}
                    >
                        <Square fill="currentColor" size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
