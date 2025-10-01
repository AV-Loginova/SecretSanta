import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useUser } from '@hooks/useUser/useUser';
import { logoutUser } from '@shared/api/users/logout';
import { useLoader } from '@hooks/useUser/useLoader/useLoader';

export const HeaderProfile = () => {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const loader = useLoader();

  const handleLogout = async () => {
    try {
      loader.open();
      await logoutUser();

      queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch (err) {
      console.error(err);
    } finally {
      loader.close();
    }
  };

  return (
    <div className="dropdown dropdown-end mr-5">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className=" rounded-full ">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name || 'Avatar'}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <span className=" bg-gray-300 rounded-full flex items-center justify-center  w-9 h-9">
              {user?.name?.[0].toUpperCase() || 'U'}
            </span>
          )}
        </div>
      </div>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-4 w-52 p-2 shadow"
      >
        <li>
          <Link href="/profile">Профиль</Link>
        </li>
        <li>
          <Link href="/wishlist">Вишлист</Link>
        </li>

        <li>
          <button className="text-red-400" onClick={handleLogout}>
            Выйти
          </button>
        </li>
      </ul>
      {loader.render()}
    </div>
  );
};
