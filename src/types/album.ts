export interface Album {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  cover_image?: string;
  is_shared: boolean;
  share_token?: string;
  created_at: string;
  updated_at: string;
}

export interface AlbumMedia {
  id: string;
  album_id: string;
  media_id: string;
  media_type: 'photo' | 'video';
  added_at: string;
}
