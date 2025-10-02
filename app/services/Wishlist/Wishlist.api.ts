import { WishlistItem } from '@prisma/client';
import { request } from '@shared/api/request';

export const wishlistApi = {
  getByUser(userId: string) {
    return request<WishlistItem[]>(`/api/wishlist/${userId}`);
  },

  create(
    data: Omit<WishlistItem, 'id' | 'createdAt' | 'user'> & { userId: number }
  ) {
    return request<WishlistItem>('/api/wishlist/create', {
      method: 'POST',
      json: data,
    });
  },

  update(data: Omit<WishlistItem, 'user' | 'createdAt'>) {
    return request<WishlistItem>('/api/wishlist/update', {
      method: 'POST',
      json: data,
    });
  },

  delete(id: number) {
    return request<void>('/api/wishlist/delete', {
      method: 'POST',
      json: { id },
    });
  },
};
