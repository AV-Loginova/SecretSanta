'use client';

import { useLoader } from '@hooks/useUser/useLoader/useLoader';
import { useUser } from './hooks/useUser/useUser';
import { useEffect } from 'react';

export default function Home() {
  const { data: user, isLoading } = useUser();
  const loader = useLoader();

  useEffect(() => {
    if (isLoading) {
      loader.open();
    } else {
      loader.close();
    }
  }, [isLoading]);

  return (
    <div className="hero h-screen">
      <div className="hero-content text-center">
        {!isLoading && (
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              Привет, {user?.name || 'дружок'}!
            </h1>
            <p className="py-6">
              Ты попал в дружескую игру &quot;Тайный Санта&quot; для лучших
              друзьяшек. Что ты можешь сделать?
            </p>
            <button className="btn btn-primary rounded-full">Начать</button>
          </div>
        )}
      </div>
      {loader.render()}
    </div>
  );
}
