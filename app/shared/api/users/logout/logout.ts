import { request } from '@shared/api/request';

export const logoutUser = async () => {
  const res = await request('/api/logout', {
    method: 'POST',
  });

  if (!res) {
    throw new Error('Logout failed');
  }
};
