'use client';

import { useState } from 'react';
import { FiMenu, FiSearch, FiPlus, FiHelpCircle, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import UploadButton from '@/components/upload/UploadButton';
import SearchBar from '@/components/shared/SearchBar';

interface TopNavProps {
  onMenuClick: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          >
            <FiMenu size={24} />
          </button>
          <div className="hidden md:block">
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiSearch size={20} />
            </button>
          </div>

          <UploadButton />

          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:block">
            <FiHelpCircle size={20} />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold hover:ring-2 hover:ring-primary-300 transition"
            >
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium">{user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Profile Settings
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  onClick={() => setShowProfileMenu(false)}
                >
                  My Photos
                </Link>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    // signOut();
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden mt-3">
        <SearchBar />
      </div>
    </header>
  );
}
