import React from 'react';

import { ModalInnerProps } from '../ModalInner.types';

export const ConfirmModal = (props: ModalInnerProps) => {
  const {
    text = 'Жеееесть! Что-то поломалось...',
    handleDelete,
    handleClose,
  } = props;
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Вы уверены?</h3>
        <p className="py-4">{text}</p>
        <div className="modal-action">
          <button className="btn btn-ghost rounded-full" onClick={handleDelete}>
            Да
          </button>
          <button
            className="btn btn-soft btn-error rounded-full"
            onClick={handleClose}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};
