'use client';

interface StorageIndicatorProps {
  used: number;
  limit: number;
}

export default function StorageIndicator({ used, limit }: StorageIndicatorProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const usedGB = (used / 1024 / 1024 / 1024).toFixed(1);
  const limitGB = (limit / 1024 / 1024 / 1024).toFixed(0);

  return (
    <div className="min-w-[200px]">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
        <span>Storage</span>
        <span>
          {usedGB} GB / {limitGB} GB
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage > 90 && (
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
          ⚠️ Storage almost full
        </p>
      )}
    </div>
  );
}
