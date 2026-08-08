'use client';

interface GallerySkeletonProps {
  count?: number;
}

export default function GallerySkeleton({ count = 12 }: GallerySkeletonProps) {
  return (
    <div className="gallery-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
      ))}
    </div>
  );
}
