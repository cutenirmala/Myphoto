'use client';

import { UploadProgress } from '@/types/photo';
import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

interface UploadProgressItemProps {
  upload: UploadProgress;
  onRemove: () => void;
}

export default function UploadProgressItem({ upload, onRemove }: UploadProgressItemProps) {
  const { file, progress, status, error } = upload;

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <FiCheck className="text-green-500" />;
      case 'error':
        return <FiAlertCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{file.name}</span>
            {getStatusIcon()}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {status === 'success' ? '✓' : `${progress}%`}
            </span>
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {(file.size / 1024 / 1024).toFixed(1)} MB
          </p>
        </div>
        {(status === 'success' || status === 'error') && (
          <button
            onClick={onRemove}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            <FiX size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
