import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Play, Signal } from 'lucide-react';
import { useRunStore } from '../../store/runStore';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet with React
// @ts-ignore
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker() {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    const map = useMap();

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        });
    }, [map]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Você está aqui</Popup>
        </Marker>
    );
}

export default function RunReady() {
    const { startRun } = useRunStore();
    const [gpsStatus, setGpsStatus] = useState<'searching' | 'ok' | 'denied'>('searching');

    useEffect(() => {
        if (!navigator.geolocation) {
            setGpsStatus('denied');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            () => setGpsStatus('ok'),
            (err) => {
                console.error(err);
                if (err.code === 1) setGpsStatus('denied'); // Permission denied
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    }, []);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Map Preview */}
            <div style={{ flex: 1, position: 'relative' }}>
                <MapContainer center={[-23.5505, -46.6333]} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                    <TileLayer
                        attribution='&copy; Google'
                        url="http://mt0.google.com/vt/lyrs=m&hl=pt-BR&x={x}&y={y}&z={z}"
                    />
                    <LocationMarker />
                </MapContainer>

                {/* Overlay Header */}
                <div style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    right: 20,
                    background: 'rgba(255,255,255,0.9)',
                    padding: '10px 15px',
                    borderRadius: '12px',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: 8, height: 8,
                            borderRadius: '50%',
                            background: gpsStatus === 'ok' ? '#10B981' : gpsStatus === 'denied' ? '#EF4444' : '#F59E0B'
                        }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#374151' }}>
                            {gpsStatus === 'ok' ? 'GPS Pronto' : gpsStatus === 'denied' ? 'GPS Negado' : 'Procurando GPS...'}
                        </span>
                    </div>
                    {gpsStatus !== 'ok' && <Signal size={16} color="#6B7280" />}
                </div>
            </div>

            {/* Bottom Action Area */}
            <div style={{ padding: '24px', background: 'white', borderTop: '1px solid #E5E7EB' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Pronto para correr?</h2>
                    <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>O GPS rastreará seu percurso e ritmo.</p>
                </div>

                <button
                    onClick={startRun}
                    disabled={gpsStatus === 'denied'}
                    style={{
                        width: '100%',
                        background: gpsStatus === 'denied' ? '#9CA3AF' : '#10B981', // Green-500
                        color: 'white',
                        padding: '16px',
                        borderRadius: '16px',
                        border: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.4)',
                        cursor: gpsStatus === 'denied' ? 'not-allowed' : 'pointer'
                    }}
                >
                    <Play fill="currentColor" size={24} />
                    INICIAR CORRIDA
                </button>

                {gpsStatus === 'denied' && (
                    <p style={{ color: '#EF4444', fontSize: '0.8rem', textAlign: 'center', marginTop: '10px' }}>
                        Habilite a localização nas configurações.
                    </p>
                )}

                <RunHistoryList />
            </div>
        </div>
    );
}

function RunHistoryList() {
    const { history } = useRunStore();

    if (history.length === 0) return null;

    return (
        <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Histórico Recente</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.slice(0, 3).map(run => (
                    <div key={run.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#F9FAFB', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{(run.distance / 1000).toFixed(2)} km</span>
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                {new Date(run.startTime).toLocaleDateString()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>
                                {Math.floor(run.duration / 60)}:{(run.duration % 60).toString().padStart(2, '0')}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                {Math.floor(run.pace)}'{Math.floor((run.pace % 1) * 60)}'' /km
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
