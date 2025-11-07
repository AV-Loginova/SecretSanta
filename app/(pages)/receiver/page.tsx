'use client';

import React, { useEffect, useState } from 'react';

import { WishlistCard } from '@components/WishlistCard/WishlistCard';
import { Countdown } from '@components/Countdown/Countdown';

import { useLoader } from '@hooks/useUser/useLoader/useLoader';

import { UserApi } from '@services/User/User.api';

//todo types
type WishlistItem = {
  id: number;
  title: string;
  description?: string;
  price?: string;
  link?: string;
  imageUrl?: string;
};

type Receiver = {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  wishlist: WishlistItem[];
};

const ReceiverPage = () => {
  const [receiver, setReceiver] = useState<Receiver | null>(null);
  const [loading, setLoading] = useState(true);
  const loader = useLoader();

  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        loader.open();

        const data = (await UserApi.getReceiver()) as { receiver?: Receiver };

        setReceiver(data?.receiver || null);
      } catch (error) {
        console.error('Failed to fetch receiver:', error);
      } finally {
        setLoading(false);
        loader.close();
      }
    };

    fetchReceiver();
  }, []);

  if (loading) {
    return loader.render();
  }

  if (!receiver) {
    return (
      <div className="text-center py-20 text-lg flex flex-col items-center">
        🤷‍♀️ Распределение ещё не состоялось, подожди немного!
        <Countdown targetDate="2025-11-30T00:00:00" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center lg:items-stretch p-8">
      <div className="lg:flex lg:justify-between text-center">
        <div className="stats stats-vertical bg-base-100 lg:stats-horizontal text-left shadow mb-8">
          <div className="stat">
            <div className="stat-title">Имя получателя</div>
            <div className="stat-value text-secondary">{receiver.name}</div>
            <div className="stat-desc">{receiver.email}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Подарков в вишлисте</div>
            <div className="stat-value">{receiver.wishlist.length}</div>
            <div className="stat-desc">🎁 идей для вдохновения</div>
          </div>

          <div className="stat">
            <div className="stat-desc mb-2">Будущий счастливчик</div>
            <div className="stat-value">
              {receiver.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={receiver.avatarUrl}
                  alt={receiver.name}
                  className="w-16 h-16 rounded-full object-cover border"
                />
              ) : (
                '😶'
              )}
            </div>
          </div>
        </div>
        <Countdown targetDate="2025-12-31T00:00:00" />
      </div>

      {receiver.wishlist.length > 0 ? (
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-wrap lg:justify-start justify-center gap-6 ">
            {receiver.wishlist.map((item) => (
              <WishlistCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          У получателя пока нет пожеланий 😅
        </p>
      )}
    </div>
  );
};

export default ReceiverPage;
