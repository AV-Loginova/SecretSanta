import React from 'react';

import { ModalInnerProps } from '../ModalInner.types';

export const ErrorModal = (props: ModalInnerProps) => {
  const { header = 'Ошибка', text = 'Жеееесть! Что-то поломалось...' } = props;
  return (
    <div>
      <h3 className="font-bold text-lg">{header}</h3>
      <p className="py-4">{text}</p>
    </div>
  );
};
