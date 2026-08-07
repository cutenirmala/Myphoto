'use client';

import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import UploadZone from './UploadZone';

interface UploadButtonProps {
  onClose?: () => void;
}

export default function UploadButton({ onClose }: UploadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
      >
        <FiPlus size={20} />
        <span className="hidden sm:inline">Upload</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Media</h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  ✕
                </button>
              </div>
              <UploadZone onUploadComplete={handleClose} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
