import React from 'react';
import { GraduationCap, Sparkles, Terminal } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-50 flex flex-col transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="w-full bg-white dark:bg-zinc-900 border-b-2 border-black dark:border-zinc-800 sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 text-black rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-zinc-900 dark:text-zinc-100">
                  CRS.Microservices
                </span>
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-extrabold uppercase bg-pink-400 text-black rounded-full border border-black">
                  Buổi 05
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hidden sm:block">
                Hệ Thống Đăng Ký Môn Học Trực Tuyến
              </p>
            </div>
          </div>

          {/* Right Header Status & Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold rounded-xl border-2 border-black dark:border-zinc-700 shadow-[2px_2px_0px_#000000]">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              <span>Gateway: :8080</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area - Full width responsive */}
      <main className="w-full flex-1">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t-2 border-black dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 py-4 mt-auto">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              © 2026 CRS Project — Kiến trúc Microservices
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-sky-500" />
            <span>Spring Boot 4.1.0 • React Vite TypeScript</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
