// shared/api/users/useUser.ts
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  name: string | null;
  email: string;
  avatarUrl?: string | null;
  role: string;
}

export const useUser = () => {
  return useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/me/get');

      if (res.status === 401) {
        return null;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch user');
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
