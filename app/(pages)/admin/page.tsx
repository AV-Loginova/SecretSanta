'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { useUser } from '@hooks/useUser/useUser';
import { UserList } from '@components/Admin/UserList/UserList';

const AdminPage = () => {
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  if (!user || (user.role !== 'admin' && user.role !== 'super')) {
    router.push('/');

    return null;
  }

  return (
    <div className="p-20">
      <h1 className="text-2xl font-bold mb-4">Админ панель</h1>
      <UserList />
    </div>
  );
};

export default AdminPage;
