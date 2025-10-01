'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { request } from '@shared/api/request';
import { User } from '@prisma/client';
import { useModal } from '@hooks/useModal/useModal';
import { ConfirmModal } from '@components/ModalInner/Confirm/Confirm';
import { ErrorModal } from '@components/ModalInner/Error';
import { SuccessModal } from '@components/ModalInner/Success/Success';

const UserPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const modal = useModal();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    avatarUrl: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await request<User>(`/api/admin/users/${id}`, {
          credentials: 'include',
        });

        setUser(res);

        setFormData({
          name: res.name,
          email: res.email,
          role: res.role,
          avatarUrl: res.avatarUrl || '',
        });
      } catch (err) {
        console.error(err);
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await request(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      setUser({ ...user!, ...formData });
      setEditMode(false);
    } catch {
      modal.open(<ErrorModal />);
    }
  };

  const handleDelete = () => {
    modal.open(
      <ConfirmModal
        text={`Вы действительно хотите удалить пользователя ${user?.name}?`}
        handleDelete={async () => {
          try {
            await request(`/api/admin/users/delete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ids: [user?.id] }),
              credentials: 'include',
            });
            modal.close();
            router.push('/admin/users');
          } catch {
            modal.open(<ErrorModal />);
          }
        }}
        handleClose={modal.close}
      />
    );
  };

  const handleResetPassword = () => {
    modal.open(
      <ConfirmModal
        text={`Вы действительно хотите сбросить пароль для пользователя ${user?.name}?`}
        handleDelete={async () => {
          try {
            await request(`/api/admin/users/${id}/reset-password`, {
              method: 'POST',
              credentials: 'include',
            });

            modal.close();

            modal.open(<SuccessModal />);
          } catch {
            modal.open(<ErrorModal />);
          }
        }}
        handleClose={modal.close}
      />
    );
  };

  if (loading) return <p>Загрузка...</p>;
  if (!user) return <p>Пользователь не найден</p>;

  return (
    <div className="w-full h-screen mx-auto p-10 bg-base-200 shadow-md mt-[4rem]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Профиль пользователя</h2>
        <div className="flex gap-2">
          {!editMode && (
            <button
              className="btn btn-sm btn-ghost rounded-full"
              onClick={() => setEditMode(true)}
            >
              Редактировать
            </button>
          )}

          <button
            className="btn btn-sm btn-warning rounded-full"
            onClick={handleResetPassword}
          >
            Сбросить пароль
          </button>
          <button
            className="btn btn-sm btn-error rounded-full"
            onClick={handleDelete}
          >
            Удалить
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="avatar">
          <div className="mask mask-squircle w-24 h-24">
            <Image
              width={96}
              height={96}
              src={
                formData.avatarUrl ||
                'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp'
              }
              alt="Avatar"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Имя</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input input-bordered w-full ${!editMode && 'bg-base-200'}`}
            disabled={!editMode}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input input-bordered w-full ${!editMode && 'bg-base-200'}`}
            disabled={!editMode}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Роль</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`select select-bordered w-full ${!editMode && 'bg-base-200'}`}
            disabled={!editMode}
          >
            <option value="user">Пользователь</option>
            <option value="admin">Админ</option>
            <option value="super">Супер админ</option>
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">URL аватара</span>
          </label>
          <input
            type="text"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            className={`input input-bordered w-full ${!editMode && 'bg-base-200'}`}
            disabled={!editMode}
          />
        </div>

        {editMode && (
          <button
            className="btn btn-success mt-4 rounded-full w-max"
            onClick={handleSave}
          >
            Сохранить изменения
          </button>
        )}
      </div>

      {modal.render()}
    </div>
  );
};

export default UserPage;
