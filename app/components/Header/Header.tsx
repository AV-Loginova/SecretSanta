'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoSunny, IoMoon } from 'react-icons/io5';

import { useUser } from '@hooks/useUser/useUser';

import { HeaderProfile } from './components/HeaderProfile';

export const Header = () => {
  const { data: user, isLoading } = useUser();
  const isAdmin = user?.role === 'admin' || user?.role === 'super';

  const [theme, setTheme] = useState('cupcake');

  useEffect(() => {
    const storedTheme =
      user?.theme || localStorage.getItem('theme') || 'cupcake';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, [user]);

  const toggleTheme = async () => {
    const newTheme = theme === 'cupcake' ? 'dracula' : 'cupcake';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    if (user) {
      try {
        await fetch('/api/me/theme', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ theme: newTheme }),
        });
      } catch (err) {
        console.error('Failed to save theme:', err);
      }
    }
  };

  return (
    <header className="navbar z-100 p-0">
      <div className="flex navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link className="btn btn-ghost text-xl rounded-full" href={'/'}>
            Тайный Санта
          </Link>
        </div>

        <div className="flex-none">
          {!isLoading && !user && (
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link href={'/register'}>Регистрация</Link>
              </li>
              <li>
                <Link href={'/login'}>Войти</Link>
              </li>
            </ul>
          )}

          {!isLoading && user && (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="btn btn-sm btn-ghost rounded-full"
                >
                  Админ панель
                </Link>
              )}

              <HeaderProfile />

              <label className="swap swap-rotate mr-3">
                <input
                  type="checkbox"
                  checked={theme === 'dracula'}
                  onChange={toggleTheme}
                />
                <IoSunny className="swap-on text-xl" />
                <IoMoon className="swap-off text-xl" />
              </label>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
