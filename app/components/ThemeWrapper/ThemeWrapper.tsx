'use client';

import { useEffect, useState } from 'react';
import { Header } from '@components/Header';
import { useUser } from '@hooks/useUser/useUser';

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: user } = useUser();
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const userTheme = user?.theme || localStorage.getItem('theme') || 'cupcake';
    document.documentElement.setAttribute('data-theme', userTheme);
    setTheme(userTheme);
  }, [user]);

  if (!theme) return null; // пока тема не определена, ничего не рендерим

  return (
    <div className="flex flex-col min-h-screen bg-base-200 text-base-content overflow-auto">
      <Header setTheme={setTheme} theme={theme} />
      <main className="grow">{children}</main>
    </div>
  );
};

export default ThemeWrapper;
