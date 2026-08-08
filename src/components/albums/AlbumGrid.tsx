'use client';

import { Album } from '@/types/album';
import AlbumCard from './AlbumCard';
import { FiFolder } from 'react-icons/fi';

interface AlbumGridProps {
  albums: Album[];
  loading: boolean;
  onRefresh: () => void;
}

export default function AlbumGrid({ albums, loading, onRefresh }: AlbumGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No albums yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create your first album to organize your photos
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} onRefresh={onRefresh} />
      ))}
    </div>
  );
}
