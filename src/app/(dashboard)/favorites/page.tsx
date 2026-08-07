'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PhotoGrid from '@/components/gallery/PhotoGrid';
import { supabase } from '@/lib/supabase/client';
import { Photo } from '@/types/photo';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_favorite', true)
        .eq('is_trash', false)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error: any) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Favorites</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </p>
        </div>
      </div>

      <PhotoGrid photos={photos} loading={loading} onRefresh={fetchFavorites} />
    </div>
  );
}
