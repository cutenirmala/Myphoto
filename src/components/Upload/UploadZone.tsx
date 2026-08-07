'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { UploadProgress } from '@/types/photo';
import UploadProgressItem from './UploadProgress';
import toast from 'react-hot-toast';

interface UploadZoneProps {
  onUploadComplete?: () => void;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
};

export default function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user) {
        toast.error('Please sign in to upload');
        return;
      }

      // Filter and validate files
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} is too large (max 100MB)`);
          return false;
        }
        if (!Object.keys(ALLOWED_TYPES).includes(file.type)) {
          toast.error(`${file.name} is not a supported format`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      // Initialize upload progress
      const newUploads = validFiles.map((file) => ({
        file,
        progress: 0,
        status: 'uploading' as const,
      }));
      setUploads((prev) => [...prev, ...newUploads]);
      setIsUploading(true);

      // Upload each file
      for (const upload of newUploads) {
        try {
          const file = upload.file;
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          // Upload to Supabase Storage
          const { data: storageData, error: storageError } = await supabase.storage
            .from('photos')
            .upload(fileName, file);

          if (storageError) throw storageError;

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('photos')
            .getPublicUrl(fileName);

          // Save to database
          const isVideo = file.type.startsWith('video/');
          const { data: photoData, error: dbError } = await supabase
            .from('photos')
            .insert({
              user_id: user.id,
              file_name: file.name,
              file_path: fileName,
              file_url: urlData.publicUrl,
              mime_type: file.type,
              size: file.size,
              is_video: isVideo,
              uploaded_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (dbError) throw dbError;

          // Update progress
          setUploads((prev) =>
            prev.map((u) =>
              u.file === file
                ? { ...u, status: 'success', progress: 100, url: urlData.publicUrl }
                : u
            )
          );

          // Update user storage
          await supabase.rpc('increment_storage', {
            user_id: user.id,
            amount: file.size,
          });

          toast.success(`Uploaded ${file.name}`);
        } catch (error: any) {
          console.error('Upload error:', error);
          setUploads((prev) =>
            prev.map((u) =>
              u.file === upload.file
                ? { ...u, status: 'error', error: error.message || 'Upload failed' }
                : u
            )
          );
          toast.error(`Failed to upload ${upload.file.name}`);
        }
      }

      setIsUploading(false);
      if (onUploadComplete) onUploadComplete();
    },
    [user, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: MAX_FILE_SIZE,
    accept: ALLOWED_TYPES,
  });

  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
          ${isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'}
          hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {isDragActive ? 'Drop your files here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              JPG, PNG, WEBP, GIF, MP4, MOV • Max 100MB
            </p>
          </div>
        </div>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {uploads.map((upload, index) => (
            <UploadProgressItem
              key={index}
              upload={upload}
              onRemove={() => removeUpload(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
            }
