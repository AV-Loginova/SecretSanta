import { User } from '@prisma/client';

import { ParamValue } from 'next/dist/server/request/params';

import { request } from '@shared/utils/request';

import { RegisterResponse, LoginPayload, LoginResponse } from './User.types';

export const UserApi = {
  getSelf() {
    return request<User | null>('/api/me/get', { credentials: 'include' });
  },

  login(data: LoginPayload) {
    return request<LoginResponse>('/api/login', {
      method: 'POST',
      json: data,
    });
  },

  logout() {
    return request('/api/logout', {
      method: 'POST',
    });
  },

  getAll() {
    return request<User[]>('/api/admin/users', { credentials: 'include' });
  },

  getById(id: ParamValue) {
    return request<User>(`/api/admin/users/${id}`, { credentials: 'include' });
  },

  getReceiver() {
    //todo тип для ресивера
    return request('/api/me/receiver-wishlist', { credentials: 'include' });
  },

  create(data: Partial<User>) {
    return request<RegisterResponse>('/api/register', {
      method: 'POST',
      json: data,
    });
  },

  //todo
  update(data: Partial<User> & { avatar?: File | null }) {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.password) formData.append('password', data.password);
    if (data.avatar) formData.append('avatar', data.avatar);

    return request<User>(`/api/me/update`, {
      method: 'PATCH',
      body: formData,
      credentials: 'include',
    });
  },

  delete(id: number[] | undefined) {
    return request<void>('/api/admin/users/delete', {
      method: 'POST',
      json: { ids: id },
      credentials: 'include',
    });
  },

  resetPassword(id: number) {
    return request<void>(`/api/admin/users/${id}/reset-password`, {
      method: 'POST',
      credentials: 'include',
    });
  },
  //todo
  updateByAdmin(id: number, data: Partial<User> & { avatar?: File | null }) {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.password) formData.append('password', data.password || '');
    if (data.avatar) formData.append('avatar', data.avatar);

    return request<User>(`/api/admin/users/${id}`, {
      method: 'PATCH',
      body: formData,
      credentials: 'include',
    });
  },
};
