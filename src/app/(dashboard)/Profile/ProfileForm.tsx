'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/types/user';
import toast from 'react-hot-toast';

interface ProfileFormProps {
  profile: User | null;
  onUpdate: () => void;
}

export default function ProfileForm({ profile, onUpdate }: ProfileForm
