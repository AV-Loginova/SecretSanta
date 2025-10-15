import { useState } from 'react';
import ReactDOM from 'react-dom';

export const useLoader = () => {
  const [isLoading, setIsLoading] = useState(false);

  const open = () => setIsLoading(true);
  const close = () => setIsLoading(false);

  const render = () => {
    if (!isLoading) {
      return null;
    }

    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-200 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <span className="loading loading-spinner text-secondary z-50 relative"></span>
      </div>,
      document.body
    );
  };

  return { open, close, render };
};
