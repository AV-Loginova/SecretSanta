import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useUser } from '@hooks/useUser/useUser';
import { logoutUser } from '@shared/api/users/logout';
import { useLoader } from '@hooks/useUser/useLoader/useLoader';

export const HeaderProfile = () => {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const loader = useLoader();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      loader.open();
      await logoutUser();

      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/');
    } catch (err) {
      console.error(err);
    } finally {
      loader.close();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative mr-3" ref={dropdownRef}>
      <div
        className="btn btn-ghost btn-circle avatar"
        onClick={() => setOpen(!open)}
      >
        <div className="rounded-full">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name || 'Avatar'}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <span className="bg-gray-300 rounded-full flex items-center justify-center w-9 h-9">
              {user?.name?.[0].toUpperCase() || 'U'}
            </span>
          )}
        </div>
      </div>

      {open && (
        <ul className="menu menu-sm absolute right-0 bg-base-100 rounded-box mt-2 w-52 p-2 shadow z-50">
          <li>
            <Link href="/profile" onClick={() => setOpen(false)}>
              Профиль
            </Link>
          </li>
          <li>
            <Link href="/wishlist" onClick={() => setOpen(false)}>
              Вишлист
            </Link>
          </li>
          <li>
            <Link href="/receiver" onClick={() => setOpen(false)}>
              Мой санта
            </Link>
          </li>
          <li>
            <button
              className="text-red-400"
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
            >
              Выйти
            </button>
          </li>
        </ul>
      )}

      {loader.render()}
    </div>
  );
};
