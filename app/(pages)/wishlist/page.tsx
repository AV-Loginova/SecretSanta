'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useUser } from '@hooks/useUser/useUser';
import { useWishlist } from '@hooks/useWishlist/useWishlist';
import { useModal } from '@hooks/useModal/useModal';
import { useLoader } from '@hooks/useUser/useLoader/useLoader';

import WishlistCard from '@components/WishlistCard/WishlistCard';
import { WishListForm } from '@components/WishListFrom/WishlistForm';
import { SuccessModal } from '@components/ModalInner/Success/Success';

import { WishlistItemType } from './wishlist.types';
import { ErrorModal } from '@components/ModalInner/Error';

const WishlistPage: React.FC = () => {
  const { data: user, isLoading: userLoading } = useUser();
  const { items, loading, createItem, deleteItem, updateItem } = useWishlist(
    Number(user?.id)
  );

  const modal = useModal();
  const loader = useLoader();

  const { reset } = useForm<Partial<WishlistItemType>>();

  const onSubmit: SubmitHandler<Partial<WishlistItemType>> = async (data) => {
    if (!user) {
      return;
    }

    loader.open();

    try {
      await createItem({
        userId: Number(user.id),
        title: data.title || '',
        link: data.link || '',
        imageUrl: data.imageUrl || '',
        description: data.description || null,
        price: data.price || null,
      });

      reset();
      modal.close();

      modal.open(<SuccessModal />, '');
    } catch (err) {
      console.error('Ошибка добавления вишлиста:', err);
      modal.open(<ErrorModal />, '');
    } finally {
      loader.close();
    }
  };

  const handleDeleteItemButtonClick = async (id: number) => {
    loader.open();

    try {
      await deleteItem(id);
      modal.open(<SuccessModal text="Предмет был удален из пожеланий" />, '');
    } catch (err) {
      console.error('Ошибка удаления элемента:', err);
      modal.open(<ErrorModal />, '');
    } finally {
      loader.close();
    }
  };

  const handleAddItemClick = () => {
    modal.open(<WishListForm onSubmit={onSubmit} />, 'Заполни форму');
  };

  const handleEditItemButtonClick = async (
    id: number,
    data: Partial<WishlistItemType>
  ) => {
    if (!user) {
      return;
    }

    loader.open();
    try {
      await updateItem(id, {
        userId: Number(user.id),
        title: data.title || '',
        imageUrl: data.imageUrl || '',
        link: data.link || null,
        description: data.description || null,
        price: data.price || null,
      });

      modal.open(<SuccessModal />, '');
    } catch (error) {
      console.error(error);
      modal.open(<ErrorModal />, '');
    } finally {
      loader.close();
    }
  };

  useEffect(() => {
    if (userLoading || loading) {
      loader.open();
    } else {
      loader.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading, loading]);

  return (
    <div className="p-10 mt-[4rem] bg-base-200 h-[calc(100vh-4rem)] overflow-auto">
      <button
        onClick={handleAddItemClick}
        className="btn btn-secondary rounded-full mb-5"
      >
        Добавить новое желание
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? null : items.length > 0 ? (
          items.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onDelete={handleDeleteItemButtonClick}
              onEdit={handleEditItemButtonClick}
            />
          ))
        ) : (
          <p>Нет элементов в вишлисте</p>
        )}
      </div>

      {modal.render()}
      {loader.render()}
    </div>
  );
};

export default WishlistPage;
