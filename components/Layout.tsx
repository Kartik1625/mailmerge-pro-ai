
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">MailMerge<span className="text-violet-600">Pro</span></h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <span className="text-sm font-medium text-zinc-500 hover:text-violet-600 cursor-pointer">Documentation</span>
            <span className="text-sm font-medium text-zinc-500 hover:text-violet-600 cursor-pointer">Support</span>
            <button className="bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-colors">
              Go Pro
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {children}
      </main>
      <footer className="py-6 border-t border-zinc-200 text-center text-sm text-zinc-400">
        &copy; 2024 MailMerge Pro AI. Enterprise-grade automation.
      </footer>
    </div>
  );
};
