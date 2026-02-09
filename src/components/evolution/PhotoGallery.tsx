import React from 'react';
import { Camera, ChevronRight, ImageIcon } from 'lucide-react';

interface Photo {
    id: string;
    date: string;
    url: string;
    label?: string;
}

interface PhotoGalleryProps {
    photos: Photo[];
    onAddPhoto: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onAddPhoto }) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Progress Gallery</h3>
                <button
                    onClick={onAddPhoto}
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                    <Camera size={16} />
                    Add Photo
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {photos && photos.length > 0 ? (
                    photos.map((photo) => (
                        <div
                            key={photo.id}
                            className="flex-none snap-start w-40 aspect-[3/4] rounded-2xl overflow-hidden glass-panel relative group"
                        >
                            <img
                                src={photo.url}
                                alt={`Progress on ${photo.date}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-100 group-hover:opacity-90 transition-opacity flex flex-col justify-end p-3">
                                <span className="text-xs font-medium text-slate-300">{photo.date}</span>
                                {photo.label && <span className="text-xs text-slate-500">{photo.label}</span>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full flex flex-col items-center justify-center py-8 glass-panel border-dashed border-slate-700 bg-slate-800/30">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 mb-3">
                            <ImageIcon size={24} />
                        </div>
                        <p className="text-sm text-slate-400 font-medium">No photos yet</p>
                        <p className="text-xs text-slate-500 mt-1">Take a photo to track your transformation</p>
                    </div>
                )}
            </div>
        </div>
    );
};
