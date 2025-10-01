'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { User } from '@prisma/client';

import { ConfirmModal } from '@components/ModalInner/Confirm/Confirm';

import { useModal } from '@hooks/useModal/useModal';
import { request } from '@shared/api/request';
import { ErrorModal } from '@components/ModalInner/Error';

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const modal = useModal();
  const router = useRouter();

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((user) => user.id));
    }
  };

  const toggleSelectUser = (id: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleDeleteButtonClick = () => {
    modal.open(
      <ConfirmModal
        text={`Вы собираетесь удалить ${selectedUserIds.length} пользователя(ей).`}
        handleDelete={handleDelete}
        handleClose={modal.close}
      />
    );
  };

  const handleDelete = async () => {
    try {
      await request('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedUserIds }),
        credentials: 'include',
      });

      setUsers((prev) =>
        prev.filter((user) => !selectedUserIds.includes(user.id))
      );
      setSelectedUserIds([]);

      modal.close();
    } catch (err) {
      console.error(err);

      modal.open(<ErrorModal />);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await request('/api/admin/users', {
          credentials: 'include',
        });

        const data = await res;

        setUsers(data);
      } catch (err) {
        console.error(err);

        modal.open(<ErrorModal />);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Загрузка пользователей...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedUserIds.length === users.length}
                  onChange={toggleSelectAll}
                />
              </label>
            </th>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Дата регистрации</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => toggleSelectUser(user.id)}
                  />
                </label>
              </th>
              <td>{user.id}</td>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
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
                  <div>
                    <div className="font-bold">{user.name}</div>
                    <div className="text-sm opacity-50">{user.email}</div>
                  </div>
                </div>
              </td>

              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>

              <th>
                <button
                  className="btn btn-ghost btn-xs rounded-full"
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                >
                  Подробнее
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUserIds.length > 0 && (
        <button
          className="btn btn-error mb-2 rounded-full"
          onClick={handleDeleteButtonClick}
        >
          Удалить ({selectedUserIds.length})
        </button>
      )}
      {modal.render()}
    </div>
  );
};
