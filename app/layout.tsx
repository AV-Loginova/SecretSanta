'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ThemeWrapper from '@components/ThemeWrapper/ThemeWrapper';

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="ru">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeWrapper>{children}</ThemeWrapper>
        </QueryClientProvider>
      </body>
    </html>
  );
}
