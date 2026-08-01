import type { ReactNode } from 'react';

import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-dvh bg-archive-50 md:px-6 md:py-8 xl:px-10 xl:py-11">
      <div className="mx-auto min-h-dvh max-w-7xl overflow-hidden bg-archive-surface md:min-h-[calc(100dvh-4rem)] md:rounded-2xl md:border md:border-white/80 md:shadow-app xl:min-h-[calc(100dvh-5.5rem)]">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
