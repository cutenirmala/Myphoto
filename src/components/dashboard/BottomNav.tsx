'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiHeart, FiFolder, FiPlus, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import UploadButton from '@/components/upload/UploadButton';

export default function BottomNav() {
  const pathname = usePathname();
  const [showUpload, setShowUpload] = useState(false);

  const navItems = [
    { icon: FiHome, label: 'Home', href: '/dashboard' },
    { icon: FiHeart, label: 'Favorites', href: '/favorites' },
    { icon: FiFolder, label: 'Albums', href: '/albums' },
    { icon: FiUser, label: 'Profile', href: '/profile' },
  ];

  return (
    <>
      <nav className="bottom-nav md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 ${
                isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setShowUpload(true)}
          className="flex flex-col items-center p-2 text-primary-600 dark:text-primary-400"
        >
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center -mt-4 shadow-lg">
            <FiPlus size={24} className="text-white" />
          </div>
          <span className="text-xs mt-1">Upload</span>
        </button>
      </nav>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowUpload(false)} />
          <div className="relative bg-white dark:bg-gray-900 w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
            <UploadButton onClose={() => setShowUpload(false)} />
          </div>
        </div>
      )}
    </>
  );
}
