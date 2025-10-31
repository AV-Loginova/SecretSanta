'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { UserApi } from '@services/User/User.api';

import { useUser } from '@hooks/useUser/useUser';
import { useLoader } from '@hooks/useUser/useLoader/useLoader';
import { useModal } from '@hooks/useModal/useModal';

import { ErrorModal } from '@components/ModalInner/Error';
import { SuccessModal } from '@components/ModalInner/Success/Success';

//todo types
interface ProfileFormData {
  name: string | null;
  email: string;
  password?: string;
  avatar?: FileList;
}

const Page = () => {
  const { data: user, refetch, isLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const loader = useLoader();
  const modal = useModal();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
  });

  useEffect(() => {
    if (isLoading) {
      loader.open();
    } else {
      loader.close();

      if (!user) {
        router.push('/');
      }
    }
  }, [isLoading, user, loader, router]);

  const avatar = watch('avatar');
  const email = watch('email');
  const name = watch('name');

  const isFormChanged =
    name !== user?.name ||
    email !== user?.email ||
    (avatar && avatar.length > 0);

  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(user?.avatarUrl || null);
    }
  }, [avatar, user]);

  const onSubmit = async (data: ProfileFormData) => {
    const { name, email, password, avatar } = data;

    setLoading(true);

    const payload = {
      name: name,
      email: email,
      password: password,
      avatar: avatar?.[0] || null,
    };

    try {
      //todo types
      await UserApi.update(payload);
      await refetch?.();

      modal.open(<SuccessModal />, '');
    } catch {
      modal.open(<ErrorModal header="Ошибка обновления профиля" />, '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-full h-screen flex items-center justify-center flex-col mx-auto">
      {user && (
        <div className="card bg-base-100 w-96 shadow-sm p-5">
          <figure>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register('avatar')}
              />
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Аватар"
                  width={100}
                  height={100}
                  className="w-full max-h-52"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-xl">
                  {user?.name?.[0].toUpperCase() || 'U'}
                </div>
              )}
            </label>
          </figure>
          <div className="avatar mb-6"></div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              defaultValue={user?.name || 'Имя'}
              className="input w-full"
              {...register('name')}
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}

            <input
              defaultValue={user?.email || 'Почта'}
              className="input w-full"
              type="email"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}

            <button
              type="submit"
              className="w-30 btn btn-primary mt-4 rounded-full"
              disabled={loading || !isFormChanged}
            >
              {loading ? 'Сохраняем...' : 'Сохранить'}
            </button>
          </form>
        </div>
      )}

      {loader.render()}
      {modal.render()}
    </div>
  );
};

export default Page;
