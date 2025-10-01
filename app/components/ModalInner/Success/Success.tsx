import React from 'react';

import { ModalInnerProps } from '../ModalInner.types';

export const SuccessModal = (props: ModalInnerProps) => {
  const { header = '', text = 'Ура! Все получилось :)' } = props;

  return (
    <div>
      <h3 className="font-bold text-lg">{header}</h3>
      <p className="py-4">{text}</p>
    </div>
  );
};
