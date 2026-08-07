export interface Share {
  id: string;
  user_id: string;
  media_id?: string;
  album_id?: string;
  share_token: string;
  share_url: string;
  is_public: boolean;
  expires_at?: string;
  created_at: string;
}
