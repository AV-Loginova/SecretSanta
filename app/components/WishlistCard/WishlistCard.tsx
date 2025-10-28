'use client';

import React, { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { useForm, SubmitHandler } from 'react-hook-form';

import { WishlistCardProps } from './WishlistCard.types';

type FormValues = {
  title: string;
  description: string;
  price: string;
  link: string;
  imageUrl: string;
};

export const WishlistCard = ({ item, onDelete, onEdit }: WishlistCardProps) => {
  const { id, title, description, price, link, imageUrl } = item;
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      title: title || '',
      description: description || '',
      price: price || '',
      link: link || '',
      imageUrl: imageUrl || '',
    },
  });

  const formValues = watch();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (onEdit) {
      onEdit(id, data);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure className="max-h-58 relative">
        {!isEditing && onEdit && (
          <button
            className="btn btn-accent btn-sm rounded-full absolute right-2 top-2"
            onClick={() => setIsEditing(true)}
          >
            <CiEdit size={20} />
          </button>
        )}
        {formValues.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={formValues.imageUrl} alt={formValues.title} />
        ) : (
          <div className="w-full h-58 bg-base-300"></div>
        )}
      </figure>

      <div className="card-body">
        {isEditing ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <label className="input">
              <span className="label w-32">Картинка</span>
              <input
                type="text"
                placeholder="Ссылка"
                {...register('imageUrl')}
              />
            </label>

            <label className="input">
              <span className="label w-32">Название</span>
              <input
                type="text"
                className="card-title"
                placeholder="Название"
                {...register('title')}
              />
            </label>

            <textarea
              className="textarea"
              placeholder="Описание"
              {...register('description')}
            />

            <label className="input">
              <span className="label w-32">Цена</span>
              <input type="text" placeholder="Цена" {...register('price')} />
            </label>

            <label className="input">
              <span className="label w-32">Ссылка</span>
              <input type="text" placeholder="Ссылка" {...register('link')} />
            </label>

            <div className="card-actions justify-end mt-2">
              <button
                type="submit"
                className="btn btn-success btn-sm rounded-full text-white"
              >
                Сохранить
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm rounded-full"
                onClick={handleCancel}
              >
                Отменить
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2
              className="card-title h-[30px] mb-3 text-ellipsis break-words"
              title={title}
            >
              {title}
            </h2>
            <p className="break-words max-h-[100px] overflow-auto">
              {description}
            </p>
            <p className="font-bold break-words">{price}</p>

            <div className="card-actions justify-end mt-2">
              {link && (
                <a
                  className="btn btn-primary btn-sm rounded-full"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Посмотреть в магазине
                </a>
              )}
              {onDelete && (
                <button
                  className="btn btn-error btn-sm rounded-full text-white"
                  onClick={() => onDelete(id)}
                >
                  Удалить
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
