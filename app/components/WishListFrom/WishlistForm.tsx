import React from 'react';
import { useForm } from 'react-hook-form';

import { WishlistItemType } from 'app/(pages)/wishlist/wishlist.types';
import { WishlistFormProps } from './WishlistFrom.props';

export const WishListForm = (props: WishlistFormProps) => {
  const { onSubmit } = props;
  const { register, handleSubmit } = useForm<WishlistItemType>();

  return (
    <form
      className="mb-8 grid gap-3 max-w-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        type="text"
        placeholder="Название"
        className="input input-bordered w-full"
        {...register('title', { required: true })}
      />
      <input
        type="text"
        placeholder="Ссылка"
        className="input input-bordered w-full"
        {...register('link')}
      />
      <input
        type="text"
        placeholder="URL картинки"
        className="input input-bordered w-full"
        {...register('imageUrl')}
      />
      <input
        type="text"
        placeholder="Описание"
        className="input input-bordered w-full"
        {...register('description')}
      />
      <input
        type="text"
        placeholder="Примерная цена"
        className="input input-bordered w-full"
        {...register('price')}
      />
      <button type="submit" className="btn btn-primary rounded-full w-max">
        Добавить
      </button>
    </form>
  );
};
