import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    //out layer of the app - give it style
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      // header of the app - will get header component
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-purple-900 flex items-center gap-2">
            📖 My Book Archive
        </h1>
        </div>
      </header>
      // main content of the app - render the books
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}