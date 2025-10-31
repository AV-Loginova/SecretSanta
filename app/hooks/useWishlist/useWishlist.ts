import { useEffect, useState } from 'react';
import { WishlistItem } from '@prisma/client';

import { wishlistApi } from '@services/Wishlist/Wishlist.api';

export function useWishlist(userId?: number) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const data = await wishlistApi.getByUser(userId.toString());
        setItems(data);
      } catch (err) {
        console.error('Ошибка загрузки вишлиста:', err);

        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const createItem = async (
    item: Omit<WishlistItem, 'id' | 'createdAt' | 'user'> & { userId: number }
  ) => {
    const newItem = await wishlistApi.create(item);
    setItems((prev) => [newItem, ...prev]);

    return newItem;
  };

  const deleteItem = async (id: number) => {
    await wishlistApi.delete(id);

    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = async (
    id: number,
    data: Partial<Omit<WishlistItem, 'id' | 'createdAt' | 'user'>> & {
      userId: number;
    }
  ) => {
    const payload = {
      id,
      userId: data.userId,
      title: data.title || '',
      imageUrl: data.imageUrl || '',
      link: data.link || null,
      description: data.description || null,
      price: data.price || null,
    };

    const updatedItem = await wishlistApi.update(payload);

    setItems((prev) =>
      prev.map((item) => (item.id === id ? updatedItem : item))
    );

    return updatedItem;
  };

  return { items, loading, createItem, deleteItem, updateItem };
}
