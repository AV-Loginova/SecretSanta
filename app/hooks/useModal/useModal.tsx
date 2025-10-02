import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  content?: React.ReactNode;
  header?: string;
}

export const useModal = () => {
  const [modalProps, setModalProps] = useState<ModalProps>({});
  const [isOpen, setIsOpen] = useState(false);

  const open = (content: React.ReactNode, header: string) => {
    setModalProps({ content, header });
    setIsOpen(true);
  };

  const close = useCallback(() => {
    setModalProps({});
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const render = () => {
    if (!isOpen) {
      return null;
    }

    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={close} />

        <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 w-96">
          <div className="mt-0 flex right-5 top-0 justify-between items-center mb-5">
            <h2 className="font-bold text-lg">{modalProps.header || ''}</h2>
            <button className="btn rounded-full" onClick={close}>
              X
            </button>
          </div>
          {modalProps.content}
        </div>
      </div>,
      document.body
    );
  };

  return { open, close, render };
};
