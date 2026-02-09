import { useState, useRef, ChangeEvent } from 'react'; // Added useRef and ChangeEvent
import { X, ChevronDown, Upload, Check } from 'lucide-react'; // Updated icons
import { BodyRecord } from '../../types';
import './EvolutionGallery.css'; // Ensure CSS is imported

interface EvolutionGalleryProps {
    records: BodyRecord[];
    onSavePhoto: (data: { front?: string; side?: string; back?: string; date: string }) => void;
}

export const EvolutionGallery = ({ records, onSavePhoto }: EvolutionGalleryProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<BodyRecord | null>(null);

    // Form State
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [photos, setPhotos] = useState<{ front?: string; side?: string; back?: string }>({});
    const [activeAngle, setActiveAngle] = useState<'front' | 'side' | 'back' | null>(null);

    // File Input Ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoClick = (angle: 'front' | 'side' | 'back') => {
        setActiveAngle(angle);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeAngle) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotos(prev => ({ ...prev, [activeAngle]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!photos.front && !photos.side && !photos.back) return;

        onSavePhoto({
            front: photos.front,
            side: photos.side,
            back: photos.back,
            date
        });

        // Reset form and close
        setPhotos({});
        setIsExpanded(false);
    };

    const hasPhotos = photos.front || photos.side || photos.back;

    // Filter records that actually have photos for the strip
    const photoRecords = records.filter(r => r.photos && (r.photos.front || r.photos.side || r.photos.back));

    return (
        <div className={`evolution-card ${isExpanded ? 'expanded' : ''}`}>
            {/* Header / Accordion Trigger */}
            <div className="evolution-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="header-left">
                    <div className="icon-purple">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                    </div>
                    <div className="gallery-title">
                        <h3>Galeria de Evolução</h3>
                        <p className="gallery-subtitle">{photoRecords.length} registros • Clique para adicionar</p>
                    </div>
                </div>
                <ChevronDown className="accordion-icon" />
            </div>

            {/* Accordion Content (Upload Form) */}
            <div className="evolution-content">
                <div className="upload-form">
                    <label className="form-label">Data do Registro</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="date-input"
                    />

                    <div className="photos-grid">
                        {(['front', 'side', 'back'] as const).map((angle) => (
                            <div
                                key={angle}
                                className={`photo-upload-box ${photos[angle] ? 'has-photo' : ''}`}
                                onClick={() => handlePhotoClick(angle)}
                            >
                                {photos[angle] ? (
                                    <>
                                        <img src={photos[angle]} alt={angle} className="preview-img" />
                                        <div className="check-badge"><Check size={12} /></div>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={24} className="upload-icon" />
                                        <span className="angle-label">
                                            {angle === 'front' ? 'Frente' : angle === 'side' ? 'Lado' : 'Costas'}
                                        </span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!hasPhotos}
                        className="btn-save"
                    >
                        <Check size={18} />
                        Salvar Fotos
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden-input"
                        accept="image/*"
                    />
                </div>
            </div>

            {/* Gallery Strip */}
            {photoRecords.length > 0 && (
                <div className="gallery-strip">
                    {photoRecords.map((record) => {
                        const thumb = record.photos?.front || record.photos?.side || record.photos?.back;
                        if (!thumb) return null;

                        return (
                            <div
                                key={record.id}
                                className="gallery-item"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRecord(record);
                                }}
                            >
                                <img src={thumb} alt="Record thumbnail" />
                                <div className="gallery-overlay">
                                    <span className="gallery-date">
                                        {new Date(record.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Viewer Modal */}
            {selectedRecord && (
                <div className="viewer-overlay">
                    <div className="viewer-content">
                        <div className="viewer-header">
                            <div>
                                <h3 className="viewer-date">
                                    {new Date(selectedRecord.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </h3>
                                <p className="viewer-weight">Peso: {selectedRecord.weight}kg</p>
                            </div>
                            <button
                                onClick={() => setSelectedRecord(null)}
                                className="viewer-close-btn"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="viewer-body">
                            <div className="viewer-grid">
                                {['front', 'side', 'back'].map((angle) => {
                                    const url = selectedRecord.photos?.[angle as keyof typeof selectedRecord.photos];
                                    if (!url) return null;
                                    return (
                                        <div key={angle} className="viewer-photo-wrapper">
                                            <div className="viewer-photo-card">
                                                <img src={url} alt={angle} className="viewer-img" />
                                                <div className="viewer-label-badge">
                                                    {angle === 'front' ? 'Frente' : angle === 'side' ? 'Lado' : 'Costas'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
