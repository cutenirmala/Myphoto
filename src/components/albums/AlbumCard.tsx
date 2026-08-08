'use client';

import { useState } from 'react';
import { Album } from '@/types/album';
import { FiFolder, FiMoreVertical, FiEdit2, FiTrash2, FiShare2 } from 'react-icons/fi';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface AlbumCardProps {
  album: Album;
  onRefresh: () => void;
}

export default function AlbumCard({ album, onRefresh }: AlbumCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete album "${album.name}"?`)) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', album.id);

      if (error) throw error;
      toast.success('Album deleted');
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete album');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareToken = Math.random().toString(36).substring(7);
      const { error } = await supabase.from('shares').insert({
        user_id: album.user_id,
        album_id: album.id,
        share_token: shareToken,
        share_url: `${window.location.origin}/share/album/${shareToken}`,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      const shareUrl = `${window.location.origin}/share/album/${shareToken}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied!');
    } catch (error) {
      toast.error('Failed to create share link');
    }
  };

  return (
    <div className="group relative">
      <Link href={`/albums/${album.id}`}>
        <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-300 dark:from-primary-900 dark:to-primary-700 rounded-lg flex items-center justify-center transition-transform hover:scale-[1.02] hover:shadow-lg">
          {album.cover_image ? (
            <img
              src={album.cover_image}
              alt={album.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <FiFolder className="text-6xl text-white/70" />
          )}
        </div>
      </Link>

      <div className="mt-2 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <Link href={`/albums/${album.id}`}>
            <h3 className="font-medium text-gray-900 dark:text-white truncate hover:text-primary-600 dark:hover:text-primary-400">
              {album.name}
            </h3>
          </Link>
          {album.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {album.description}
            </p>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FiMoreVertical size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleShare();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FiShare2 size={16} />
                Share
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FiEdit2 size={16} />
                Rename
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleDelete();
                }}
                disabled={isDeleting}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <FiTrash2 size={16} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
