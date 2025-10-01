'use client';

import { useUser } from './hooks/useUser/useUser';

export default function Home() {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="hero bg-base-200 h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold">Загрузка...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero bg-base-200 h-screen">
      <div className="hero-content text-center">
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
      </div>
    </div>
  );
}
