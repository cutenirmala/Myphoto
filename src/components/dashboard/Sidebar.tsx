'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiHeart,
  FiFolder,
  FiVideo,
  FiClock,
  FiTrash2,
  FiShare2,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import classNames from 'classnames';

interface SidebarProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const navItems = [
  { icon: FiHome, label: 'Photos', href: '/dashboard' },
  { icon: FiHeart, label: 'Favorites', href: '/favorites' },
  { icon: FiFolder, label: 'Albums', href: '/albums' },
  { icon: FiVideo, label: 'Videos', href: '/videos' },
  { icon: FiClock, label: 'Recently Added', href: '/recently-added' },
  { icon: FiTrash2, label: 'Trash', href: '/trash' },
  { icon: FiShare2, label: 'Shared', href: '/shared' },
];

export default function Sidebar({ isOpen, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={classNames(
          'fixed md:relative z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
          {
            'w-64': isOpen,
            'w-0 md:w-20': !isOpen,
            'translate-x-0': isOpen,
            '-translate-x-full md:translate-x-0': !isOpen,
          }
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            {isOpen ? (
              <Link href="/dashboard" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">MyPhotos</span>
              </Link>
            ) : (
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MP</span>
              </div>
            )}
            <button
              onClick={() => setOpen(!isOpen)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:block"
            >
              {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={classNames(
                        'flex items-center px-3 py-2.5 rounded-lg transition-colors',
                        {
                          'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400': isActive,
                          'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800': !isActive,
                        }
                      )}
                    >
                      <item.icon size={20} className="flex-shrink-0" />
                      {isOpen && <span className="ml-3">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
            <Link
              href="/profile"
              className={classNames(
                'flex items-center px-3 py-2.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
                {
                  'text-gray-600 dark:text-gray-300': true,
                }
              )}
            >
              <FiSettings size={20} className="flex-shrink-0" />
              {isOpen && <span className="ml-3">Profile</span>}
            </Link>
            <button
              onClick={signOut}
              className="w-full flex items-center px-3 py-2.5 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
            >
              <FiLogOut size={20} className="flex-shrink-0" />
              {isOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
