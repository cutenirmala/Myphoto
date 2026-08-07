'use client';

import { useState } from 'react';
import PhotoCard from './PhotoCard';
import { Photo } from '@/types/photo';
import GallerySkeleton from './GallerySkeleton';
import PhotoViewer from './PhotoViewer';

interface PhotoGridProps {
  photos: Photo[];
  loading: boolean;
  onRefresh?: () => void;
}

export default function PhotoGrid({ photos, loading, onRefresh }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (loading) {
    return <GallerySkeleton count={12} />;
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🖼️</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No photos yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Upload your first photo to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="gallery-grid">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => setSelectedPhoto(photo)}
            isSelected={selectedIds.includes(photo.id)}
            onSelect={(id) => {
              setSelectedIds(prev =>
                prev.includes(id)
                  ? prev.filter(p => p !== id)
                  : [...prev, id]
              );
            }}
          />
        ))}
      </div>

      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          photos={photos}
          onClose={() => setSelectedPhoto(null)}
          onNext={() => {
            const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
            const nextIndex = (currentIndex + 1) % photos.length;
            setSelectedPhoto(photos[nextIndex]);
          }}
          onPrev={() => {
            const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
            const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
            setSelectedPhoto(photos[prevIndex]);
          }}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}
