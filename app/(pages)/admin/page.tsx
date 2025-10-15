'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { request } from '@shared/api/request';

import { useUser } from '@hooks/useUser/useUser';
import { useModal } from '@hooks/useModal/useModal';

import { UserList } from '@components/Admin/UserList/UserList';
import { SuccessModal } from '@components/ModalInner/Success';
import { ErrorModal } from '@components/ModalInner/Error';
import { useLoader } from '@hooks/useUser/useLoader/useLoader';

const AdminPage = () => {
  const { data: user, isLoading } = useUser();
  const router = useRouter();
  const modal = useModal();
  const loader = useLoader();

  useEffect(() => {
    if (isLoading) {
      loader.open();
    } else {
      loader.close();
    }
  }, [isLoading, loader]);

  // Навигация только внутри эффекта
  useEffect(() => {
    if (
      !isLoading &&
      (!user || (user.role !== 'admin' && user.role !== 'super'))
    ) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  // Пока не загружен пользователь — ничего не рендерим
  if (isLoading || !user) return null;

  const handleAssignSanta = async () => {
    try {
      loader.open();
      await request('/api/admin/secret-santa/assign', { method: 'POST' });
      modal.open(<SuccessModal />, '');
    } catch (err) {
      console.error(err);
      modal.open(<ErrorModal />, '');
    } finally {
      loader.close();
    }
  };

  return (
    <div className="p-20">
      <h1 className="text-2xl font-bold mb-4">Админ панель</h1>
      <button
        onClick={handleAssignSanta}
        className="btn btn-primary mb-6 rounded-full"
      >
        🎅 Распределить участников
      </button>
      <UserList />
      {modal.render()}
      {loader.render()}
    </div>
  );
};

export default AdminPage;
