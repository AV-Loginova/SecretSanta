'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { loginUser } from '@shared/api/users/login';
import { useUser } from '@hooks/useUser/useUser';
import { useLoader } from '@hooks/useUser/useLoader/useLoader';
import { useModal } from '@hooks/useModal/useModal';
import { ErrorModal } from '@components/ModalInner/Error';

export interface LoginFormData {
  email: string;
  password: string;
}

const Page = () => {
  const router = useRouter();
  const { refetch: refetchUser } = useUser();
  const loader = useLoader();
  const modal = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      loader.open();

      await loginUser(data);
      await refetchUser?.();

      router.push('/');
    } catch (e) {
      let message = 'Что-то пошло не так';

      if (e instanceof Error) {
        message = e.message;
      }

      modal.open(<ErrorModal header="Ошибка входа" text={message} />);
    } finally {
      loader.close();
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Войти</legend>

          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Email"
            {...register('email', { required: 'Обязательное поле' })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          <label className="label">Пароль</label>
          <input
            type="password"
            className="input"
            placeholder="Пароль"
            {...register('password', { required: 'Обязательное поле' })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}

          <button type="submit" className="btn btn-neutral mt-4 rounded-full">
            Войти
          </button>
        </fieldset>
      </form>
      {loader.render()}
      {modal.render()}
    </div>
  );
};

export default Page;
