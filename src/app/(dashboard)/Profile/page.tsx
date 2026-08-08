'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/types/user';
import ProfileForm from '@/components/profile/ProfileForm';
import ChangePassword from '@/components/profile/ChangePassword';
import StorageIndicator from '@/components/dashboard/StorageIndicator';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [storageUsed, setStorageUsed] = useState(0);
  const storageLimit = 15 * 1024 * 1024 * 1024; // 15GB

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStorageInfo();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      toast.error('Failed to load profile');
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
      console.error('Error fetching storage:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h1>

      <div className="space-y-6">
        {/* Profile Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
          <ProfileForm profile={profile} onUpdate={fetchProfile} />
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
          <ChangePassword />
        </div>

        {/* Storage */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Storage</h2>
          <StorageIndicator used={storageUsed} limit={storageLimit} />
        </div>

        {/* Account Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Email: <span className="font-medium">{user?.email}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Member since: <span className="font-medium">
                {new Date(user?.created_at || '').toLocaleDateString()}
              </span>
            </p>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
