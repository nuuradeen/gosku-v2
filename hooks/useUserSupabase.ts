'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export type UserInfo = {
  name: string;
  email: string;
  avatar: string;
};

export function useUserInfo() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        setUser({ name: 'Guest', email: '', avatar: '/avatars/default.jpg' });
      } else {
        const u = data.user;
        const firstName = u.user_metadata?.first_name;
        const lastName= u.user_metadata?.last_name;
        const fullName = firstName && lastName 
              ? `${firstName} ${lastName}`.trim()
              : firstName || lastName || u.email?.split('@')[0] || 'User';
        setUser({
          name: fullName ?? u.email!.split('@')[0],
          email: u.email!,
          avatar: u.user_metadata?.avatar_url ?? '/avatars/default.jpg',
        });
      }
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
