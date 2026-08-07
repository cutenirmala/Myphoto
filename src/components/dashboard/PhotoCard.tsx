'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Photo } from '@/types/photo';
import { FiHeart, FiCheck, FiVideo } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import classNames from 'classnames';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function PhotoCard({ photo, onClick, isSelected, onSelect }: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(photo.id);
  };

  return (
    <div
      className={classNames(
        'relative rounded-lg overflow-hidden cursor-pointer group transition-all duration-200',
        'hover:shadow-lg hover:scale-[1.02]',
        {
          'ring-2 ring-primary-500 ring-offset-2': isSelected,
        }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
        {photo.thumbnail_url || photo.file_url ? (
          <Image
            src={photo.thumbnail_url || photo.file_url}
            alt={photo.file_name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-200 dark:bg-gray-700">
            {photo.is_video ? '🎬' : '📷'}
          </div>
        )}

        {photo.is_video && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <FiVideo size={12} />
            <span>Video</span>
          </div>
        )}

        {/* Selection checkbox */}
        <div
          className={classNames(
            'absolute top-2 left-2 transition-opacity',
            {
              'opacity-100': isSelected || isHovered,
              'opacity-0': !isSelected && !isHovered,
            }
          )}
          onClick={handleSelect}
        >
          <div
            className={classNames(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
              {
                'bg-primary-600 border-primary-600 text-white': isSelected,
                'bg-white border-gray-400 hover:border-primary-600': !isSelected,
              }
            )}
          >
            {isSelected && <FiCheck size={14} />}
          </div>
        </div>

        {/* Favorite indicator */}
        {photo.is_favorite && (
          <div className="absolute top-2 right-2">
            <FiHeart className="text-red-500 fill-red-500" size={20} />
          </div>
        )}

        {/* Info overlay */}
        <div
          className={classNames(
            'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 transition-opacity',
            {
              'opacity-100': isHovered,
              'opacity-0': !isHovered,
            }
          )}
        >
          <p className="text-white text-sm truncate">{photo.file_name}</p>
          <p className="text-white/70 text-xs">
            {formatDistanceToNow(new Date(photo.uploaded_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}
