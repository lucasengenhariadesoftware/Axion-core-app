import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, ChevronLeft, Trash2 } from 'lucide-react';
import { saveTracksToDB, getTracksFromDB, deleteTrackFromDB, PersistedTrack } from '../../services/MusicDB';
interface Track {
    id: number;
    title: string;
    artist: string;
    duration: string;
    color: string;
    src?: string;
}



export const MusicPlayer: React.FC = () => {
    const [view, setView] = useState<'list' | 'player'>('list');
    const [tracks, setTracks] = useState<Track[]>([]);

    useEffect(() => {
        const loadTracks = async () => {
            try {
                const persisted = await getTracksFromDB();
                const loaded: Track[] = persisted.map(pt => {
                    // Reconstruct Blob from ArrayBuffer
                    const blob = new Blob([pt.fileData], { type: pt.fileType });
                    return {
                        id: pt.id,
                        title: pt.title,
                        artist: pt.artist,
                        duration: pt.duration,
                        color: pt.color,
                        src: URL.createObjectURL(blob)
                    };
                });
                setTracks(loaded);
            } catch (error) {
                console.error("Failed to load tracks from DB", error);
            }
        };
        loadTracks();
    }, []);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = React.useRef<HTMLAudioElement>(new Audio());
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const currentTrack = tracks[currentTrackIndex];

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            try {
                const newPersisted: PersistedTrack[] = [];
                const newTracks: Track[] = [];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const arrayBuffer = await file.arrayBuffer();
                    
                    const id = Date.now() + i;
                    const color = `linear-gradient(135deg, ${getRandomColor()} 0%, ${getRandomColor()} 100%)`;
                    
                    const pt: PersistedTrack = {
                        id,
                        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                        artist: "Dispositivo Local",
                        duration: "...",
                        color,
                        fileData: arrayBuffer,
                        fileType: file.type || 'audio/mpeg'
                    };
                    
                    newPersisted.push(pt);

                    newTracks.push({
                        id: pt.id,
                        title: pt.title,
                        artist: pt.artist,
                        duration: pt.duration,
                        color: pt.color,
                        src: URL.createObjectURL(new Blob([pt.fileData], { type: pt.fileType }))
                    });
                }

                await saveTracksToDB(newPersisted);
                setTracks((prev) => [...prev, ...newTracks]);
            } catch (error) {
                console.error("Failed to save tracks to DB", error);
            }
        }
    };

    const handleDeleteTrack = async (e: React.MouseEvent, id: number, index: number) => {
        e.stopPropagation();
        try {
            await deleteTrackFromDB(id);
            setTracks(prev => prev.filter(t => t.id !== id));

            if (currentTrackIndex === index) {
                setIsPlaying(false);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.src = '';
                }
                setCurrentTrackIndex(0);
            } else if (currentTrackIndex > index) {
                setCurrentTrackIndex(prev => prev - 1);
            }
        } catch (error) {
            console.error("Failed to delete track", error);
        }
    };

    const getRandomColor = () => {
        const colors = ['#6366f1', '#a855f7', '#3b82f6', '#2dd4bf', '#ef4444', '#f97316', '#10b981', '#f59e0b'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleTrackSelect = (index: number) => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
        setView('player');
        // Audio will be triggered by useEffect
    };

    const handleBackToList = () => {
        setView('list');
    };

    const handleNext = () => {
        if (tracks.length === 0) return;
        setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
        setIsPlaying(true);
    };

    const handlePrev = () => {
        if (tracks.length === 0) return;
        setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (tracks.length === 0) return;
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        const audio = audioRef.current;

        if (currentTrack) {
            // Only update src if it changed to avoid reloading
            if (audio.src !== currentTrack.src) {
                audio.src = currentTrack.src || '';
                audio.load();
            }

            if (isPlaying) {
                audio.play().catch(e => console.error("Playback error", e));
            } else {
                audio.pause();
            }
        }

        const updateProgress = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
                setDuration(audio.duration);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentTrackIndex, isPlaying, currentTrack]); // Dependencies

    const formatTime = (seconds: number) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (view === 'list') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px 0' }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="audio/*"
                    multiple
                    onChange={handleFileSelect}
                />

                {tracks.length === 0 && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            padding: '32px 20px',
                            textAlign: 'center',
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.03), inset 0 2px 4px rgba(255,255,255,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.1), inset 0 2px 4px rgba(255,255,255,0.8)';
                            e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03), inset 0 2px 4px rgba(255,255,255,0.5)';
                            e.currentTarget.style.border = '1px solid rgba(226, 232, 240, 0.8)';
                        }}
                    >
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #eeefff 0%, #e0e7ff 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '4px',
                            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.15)'
                        }}>
                            <Volume2 size={28} color="#4f46e5" />
                        </div>
                        <div>
                            <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#1e293b', fontSize: '16px' }}>
                                Importar Músicas
                            </p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
                                Selecione os áudios do seu dispositivo<br />para ouvir durante o treino
                            </p>
                        </div>
                    </div>
                )}

                {tracks.map((track, index) => (
                    <div
                        key={track.id}
                        onClick={() => handleTrackSelect(index)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: '#f9fafb',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            border: currentTrackIndex === index && isPlaying ? '1px solid #c7d2fe' : '1px solid transparent'
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: track.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            {currentTrackIndex === index && isPlaying ? <Volume2 size={18} /> : <Play size={18} fill="white" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{
                                margin: 0, fontSize: '14px', fontWeight: 600, color: '#374151',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px'
                            }}>
                                {track.title}
                            </h4>
                            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{track.artist}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                            <Trash2
                                size={18}
                                onClick={(e) => handleDeleteTrack(e, track.id, index)}
                                style={{ cursor: 'pointer', zIndex: 10 }}
                            />
                        </div>
                    </div>
                ))}

                {tracks.length > 0 && (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            marginTop: '12px',
                            padding: '12px',
                            width: '100%',
                            background: 'linear-gradient(to right, #ffffff, #f8fafc)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            color: '#4f46e5',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f8fafc';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(to right, #ffffff, #f8fafc)';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                    >
                        <Volume2 size={18} />
                        <span>Importar mais músicas</span>
                    </button>
                )}
            </div>
        );
    }

    return (
        <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '20px',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginTop: '10px',
            position: 'relative',
            animation: 'fadeIn 0.3s ease'
        }}>
            {/* Back Button */}
            <div
                onClick={handleBackToList}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 10,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
            >
                <ChevronLeft size={20} color="white" />
            </div>

            {/* Cover Art */}
            <div style={{
                aspectRatio: '1/1',
                borderRadius: '20px',
                background: currentTrack?.color || '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px -4px rgba(0,0,0,0.15)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
                }} />
                <Volume2 size={48} color="white" style={{ opacity: 0.8 }} />
            </div>

            {/* Track Info */}
            <div style={{ textAlign: 'center' }}>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1f2937',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                    {currentTrack?.title || "Selecione uma música"}
                </h3>
                <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0,
                    fontWeight: 500
                }}>
                    {currentTrack?.artist || "--"}
                </p>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                    width: '100%',
                    height: '6px',
                    background: '#f3f4f6',
                    borderRadius: '99px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: '#4f46e5',
                        borderRadius: '99px',
                        transition: 'width 0.1s linear'
                    }} />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#9ca3af',
                    fontWeight: 600
                }}>
                    <span>{formatTime(audioRef.current.currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 10px'
            }}>
                <Heart size={20} color="#9ca3af" style={{ cursor: 'pointer' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <SkipBack
                        size={24}
                        color="#374151"
                        fill="#374151"
                        style={{ cursor: 'pointer' }}
                        onClick={handlePrev}
                    />

                    <button
                        onClick={togglePlay}
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: '#4f46e5',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isPlaying ?
                            <Pause size={24} color="white" fill="white" /> :
                            <Play size={24} color="white" fill="white" style={{ marginLeft: '4px' }} />
                        }
                    </button>

                    <SkipForward
                        size={24}
                        color="#374151"
                        fill="#374151"
                        style={{ cursor: 'pointer' }}
                        onClick={handleNext}
                    />
                </div>

                <Volume2 size={20} color="#9ca3af" style={{ cursor: 'pointer' }} />
            </div>
        </div>
    );
};
