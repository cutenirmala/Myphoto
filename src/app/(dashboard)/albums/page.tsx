'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { Album } from '@/types/album';
import AlbumGrid from '@/components/albums/AlbumGrid';
import CreateAlbumModal from '@/components/albums/CreateAlbumModal';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AlbumsPage() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAlbums();
    }
  }, [user]);

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlbums(data || []);
    } catch (error: any) {
      toast.error('Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Albums</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {albums.length} {albums.length === 1 ? 'album' : 'albums'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <FiPlus size={20} />
          <span>Create Album</span>
        </button>
      </div>

      <AlbumGrid albums={albums} loading={loading} onRefresh={fetchAlbums} />

      {showCreateModal && (
        <CreateAlbumModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchAlbums}
        />
      )}
    </div>
  );
}
