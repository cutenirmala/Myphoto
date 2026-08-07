export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  role: 'user' | 'admin';
  storage_used: number;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}
