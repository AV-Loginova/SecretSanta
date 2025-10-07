'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { registerUser } from '@shared/api/users/register';

import { useUser } from '@hooks/useUser/useUser';
import { useLoader } from '@hooks/useUser/useLoader/useLoader';
import { useModal } from '@hooks/useModal/useModal';
import { ErrorModal } from '@components/ModalInner/Error';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Page = () => {
  const router = useRouter();
  const { refetch: refetchUser } = useUser();
  const loader = useLoader();
  const modal = useModal();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      loader.open();
      const { ...payload } = data;

      await registerUser(payload);
      await refetchUser?.();

      router.push('/');
    } catch (e) {
      let message = 'Что-то пошло не так';

      if (e instanceof Error) {
        message = e.message;
      }

      modal.open(<ErrorModal header="Ошибка регистрации" text={message} />, '');
    } finally {
      loader.close();
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-screen flex items-center justify-center"
      >
        <fieldset className="fieldset bg-white border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Регистрация</legend>

          <label className="label">Email</label>
          <input
            type="email"
            className={`input ${errors.email && 'input-error'}`}
            placeholder="Email"
            {...register('email', { required: 'Обязательное поле' })}
          />

          <label className="label">Имя</label>
          <input
            type="text"
            className={`input ${errors.name && 'input-error'}`}
            placeholder="Твое имя"
            {...register('name', { required: 'Обязательное поле' })}
          />

          <label className="label">Пароль</label>
          <input
            type="password"
            className={`input ${errors.password && 'input-error'}`}
            placeholder="Пароль"
            {...register('password', { required: 'Обязательное поле' })}
          />

          <label className="label">Повторите пароль</label>
          <input
            type="password"
            className={`input ${errors.password && 'input-error'}`}
            placeholder="Повторите пароль"
            {...register('confirmPassword', {
              required: '',
              validate: (value) => {
                return (
                  ((value === watch('password') || 'Пароли не совпадают') &&
                    value.length >= 6) ||
                  'Слишком короткий пароль'
                );
              },
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-[10px]">
              {errors.confirmPassword.message}
            </span>
          )}

          <button type="submit" className="btn btn-neutral mt-4 rounded-full">
            Зарегистрироваться
          </button>
        </fieldset>
      </form>
      {loader.render()}
      {modal.render()}
    </div>
  );
};

export default Page;
