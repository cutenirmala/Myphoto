'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PhotoGrid from '@/components/gallery/PhotoGrid';
import StorageIndicator from '@/components/dashboard/StorageIndicator';
import { supabase } from '@/lib/supabase/client';
import { Photo } from '@/types/photo';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit, setStorageLimit] = useState(15 * 1024 * 1024 * 1024); // 15GB

  useEffect(() => {
    if (user) {
      fetchPhotos();
      fetchStorageInfo();
    }
  }, [user]);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_trash', false)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error: any) {
      toast.error('Failed to load photos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStorageInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('storage_used')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setStorageUsed(data?.storage_used || 0);
    } catch (error) {
      console.error('Error fetching storage info:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Photos</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </p>
        </div>
        <StorageIndicator used={storageUsed} limit={storageLimit} />
      </div>

      <PhotoGrid photos={photos} loading={loading} onRefresh={fetchPhotos} />
    </div>
  );
}
