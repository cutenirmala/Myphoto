'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Photo } from '@/types/photo';
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiHeart,
  FiTrash2,
  FiShare2,
  FiFolder,
  FiZoomIn,
  FiZoomOut,
  FiRotateCw,
} from 'react-icons/fi';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface PhotoViewerProps {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onRefresh?: () => void;
}

export default function PhotoViewer({
  photo,
  photos,
  onClose,
  onNext,
  onPrev,
  onRefresh,
}: PhotoViewerProps) {
  const [isFavorite, setIsFavorite] = useState(photo.is_favorite);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const toggleFavorite = async () => {
    try {
      const { error } = await supabase
        .from('photos')
        .update({ is_favorite: !isFavorite })
        .eq('id', photo.id);

      if (error) throw error;
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(photo.file_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = photo.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Move this photo to trash?')) return;

    try {
      const { error } = await supabase
        .from('photos')
        .update({ is_trash: true })
        .eq('id', photo.id);

      if (error) throw error;
      toast.success('Moved to trash');
      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleShare = async () => {
    try {
      // Generate share link
      const shareToken = Math.random().toString(36).substring(7);
      const { error } = await supabase.from('shares').insert({
        user_id: photo.user_id,
        media_id: photo.id,
        share_token: shareToken,
        share_url: `${window.location.origin}/share/${shareToken}`,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      const shareUrl = `${window.location.origin}/share/${shareToken}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to create share link');
    }
  };

  return (
    <div className="photo-viewer-overlay" onClick={onClose}>
      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition"
        >
          <FiX size={24} />
        </button>

        {/* Navigation buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition"
            >
              <FiChevronLeft size={28} />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition"
            >
              <FiChevronRight size={28} />
            </button>
          </>
        )}

        {/* Image */}
        <div className="relative w-full h-full flex items-center justify-center p-16">
          {photo.is_video ? (
            <video
              src={photo.file_url}
              controls
              className="max-h-[80vh] max-w-[90vw] rounded-lg"
              autoPlay
            />
          ) : (
            <div
              className="relative max-h-[85vh] max-w-[90vw] transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            >
              <Image
                src={photo.file_url}
                alt={photo.file_name}
                width={photo.width || 1200}
                height={photo.height || 800}
                className="rounded-lg object-contain max-h-[85vh]"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            className="p-2 hover:bg-white/20 rounded-full text-white transition"
          >
            <FiZoomOut size={20} />
          </button>
          <span className="text-white text-sm min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            className="p-2 hover:bg-white/20 rounded-full text-white transition"
          >
            <FiZoomIn size={20} />
          </button>
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-2 hover:bg-white/20 rounded-full text-white transition"
          >
            <FiRotateCw size={20} />
          </button>
          <div className="w-px h-8 bg-white/30" />
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition ${
              isFavorite ? 'text-red-500' : 'text-white hover:bg-white/20'
            }`}
          >
            <FiHeart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-white/20 rounded-full text-white transition"
          >
            <FiDownload size={20} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-white/20 rounded-full text-white transition"
          >
            <FiShare2 size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-500/30 rounded-full text-white transition"
          >
            <FiTrash2 size={20} />
          </button>
        </div>

        {/* Photo info */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white text-center">
          <p className="text-sm opacity-70">{photo.file_name}</p>
          <p className="text-xs opacity-50">
            {new Date(photo.uploaded_at).toLocaleDateString()}
            {photo.width && photo.height && ` • ${photo.width}×${photo.height}`}
            {photo.size && ` • ${(photo.size / 1024 / 1024
