'use client';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { WishlistItem } from '@prisma/client';
import { useUser } from '@hooks/useUser/useUser';

type FormValues = {
  title: string;
  link: string;
  imageUrl?: string;
  description?: string;
  price?: string;
};

const WishlistPage: React.FC = () => {
  const { data: user, isLoading: userLoading } = useUser();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (!user) return;

    const fetchItems = async () => {
      try {
        const res = await fetch(`/api/wishlist/${user.id}`);

        if (!res.ok) {
          console.error('Ошибка fetch:', res.status, await res.text());
          setItems([]);
          setLoading(false);
          return;
        }

        const data = await res.json().catch(() => []);
        setItems(data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка fetch:', err);
        setItems([]);
        setLoading(false);
      }
    };

    fetchItems();
  }, [user]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) return;

    const res = await fetch('/api/wishlist/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId: user.id }),
    });

    if (!res.ok) return;

    const newItem: WishlistItem = await res.json();
    setItems((prev) => [newItem, ...prev]);
    reset();
  };

  const handleDelete = async (id: number) => {
    await fetch('/api/wishlist/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (userLoading || loading) return <p>Loading...</p>;
  if (!user) return <p>Пользователь не найден</p>;

  return (
    <div className="p-10 mt-[4rem] bg-base-200 h-[calc(100vh-4rem)] overflow-auto">
      <form
        className="mb-8 grid gap-3 max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          placeholder="Название"
          className="input input-bordered w-full"
          {...register('title', { required: true })}
        />
        <input
          type="text"
          placeholder="Ссылка"
          className="input input-bordered w-full"
          {...register('link', { required: true })}
        />
        <input
          type="text"
          placeholder="URL картинки"
          className="input input-bordered w-full"
          {...register('imageUrl')}
        />
        <input
          type="text"
          placeholder="Описание"
          className="input input-bordered w-full"
          {...register('description')}
        />
        <input
          type="text"
          placeholder="Примерная цена"
          className="input input-bordered w-full"
          {...register('price')}
        />
        <button type="submit" className="btn btn-primary rounded-full w-max">
          Добавить
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="card bg-base-100 w-96 shadow-sm">
              <figure>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={
                      item.imageUrl ||
                      'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
                    }
                    alt={item.title}
                  />
                </a>
              </figure>
              <div className="card-body">
                <h2
                  className="card-title h-[30px] overflow-scroll break-words break-all"
                  title={item.title}
                >
                  {item.title}
                </h2>
                <p className="break-words h-[100px] overflow-scroll">
                  {item.description}
                </p>
                <p className="font-bold break-words">{item.price}</p>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-error btn-sm rounded-full"
                    onClick={() => handleDelete(item.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Нет элементов в вишлисте</p>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
