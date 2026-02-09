import { useState, useRef } from 'react';
import { X, Upload, Camera, Check } from 'lucide-react';

interface PhotoUploadModalProps {
    onClose: () => void;
    onSave: (photos: { front?: string; side?: string; back?: string; date: string }) => void;
}

export const PhotoUploadModal = ({ onClose, onSave }: PhotoUploadModalProps) => {
    const [photos, setPhotos] = useState<{ front?: string; side?: string; back?: string }>({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeAngle, setActiveAngle] = useState<'front' | 'side' | 'back' | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeAngle) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotos(prev => ({ ...prev, [activeAngle]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerUpload = (angle: 'front' | 'side' | 'back') => {
        setActiveAngle(angle);
        setTimeout(() => fileInputRef.current?.click(), 0);
    };

    const handleSave = () => {
        if (!photos.front && !photos.side && !photos.back) return;
        onSave({ ...photos, date });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-lg text-gray-900">Nova Foto de Progresso</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Date Picker */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Data do Registro</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    {/* Photo Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {(['front', 'side', 'back'] as const).map((angle) => (
                            <div key={angle} className="flex flex-col gap-2">
                                <button
                                    onClick={() => triggerUpload(angle)}
                                    className={`aspect-[3/4] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden group ${photos[angle]
                                            ? 'border-emerald-500 bg-emerald-50'
                                            : 'border-gray-200 hover:border-emerald-400 hover:bg-gray-50'
                                        }`}
                                >
                                    {photos[angle] ? (
                                        <>
                                            <img src={photos[angle]} alt={angle} className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <Camera className="text-white" size={24} />
                                            </div>
                                            <div className="absolute top-1 right-1 bg-emerald-500 text-white p-1 rounded-full shadow-sm">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
                                                <Camera size={20} />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{
                                                angle === 'front' ? 'Frente' : angle === 'side' ? 'Lado' : 'Costas'
                                            }</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    <p className="text-center text-xs text-gray-400 leading-relaxed">
                        Tire as fotos com a mesma iluminação e roupas para melhor comparação.
                    </p>

                    <button
                        onClick={handleSave}
                        disabled={!photos.front && !photos.side && !photos.back}
                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-base shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Upload size={20} />
                        Salvar Fotos
                    </button>
                </div>
            </div>
        </div>
    );
};
