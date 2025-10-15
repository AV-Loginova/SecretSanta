import Link from 'next/link';

import { useUser } from '@hooks/useUser/useUser';

import { HeaderProfile } from './components/HeaderProfile';

export const Header = () => {
  const { data: user, isLoading } = useUser();
  const isAdmin = user?.role === 'admin' || user?.role === 'super';

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
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
