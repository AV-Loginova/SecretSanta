'use client';

import Image from 'next/image';
import React from 'react';

//todo types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatarUrl?: string;
  theme: string;
}

interface UserCardProps {
  user: User;
  onClose: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClose }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-md p-5 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Карточка пользователя</h2>
        <button className="btn btn-sm btn-ghost" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="avatar">
          <div className="mask mask-squircle w-24 h-24">
            <Image
              width={48}
              height={48}
              src={
                user.avatarUrl ||
                'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp'
              }
              alt="User Avatar"
            />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-bold text-lg">{user.name}</h3>
          <p className="text-sm opacity-70">{user.email}</p>
          <p className="text-sm">Роль: {user.role}</p>
          <p className="text-sm">
            Зарегистрирован: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};
