export interface Photo {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  thumbnail_url?: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number; // For videos
  is_video: boolean;
  is_favorite: boolean;
  is_trash: boolean;
  uploaded_at: string;
  metadata?: Record<string, any>;
}

export interface PhotoGroup {
  date: string;
  photos: Photo[];
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}
