'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Header } from '@components/Header';

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="ru" data-theme="cupcake">
      <QueryClientProvider client={queryClient}>
        <body className="flex flex-col min-h-screen bg-base-200 text-base-content overflow-auto">
          <Header />
          <main className="grow">{children}</main>
        </body>
      </QueryClientProvider>
    </html>
  );
}
