import { AlertOctagon, Terminal } from 'lucide-react';

interface ErrorAlertProps {
  title: string;
  description?: string;
}

export function ErrorAlert({ title, description }: ErrorAlertProps) {
  return (
    <div className="bg-rose-500/10 dark:bg-rose-950/30 border-2 border-rose-500 text-zinc-900 dark:text-zinc-100 p-4 sm:p-5 rounded-2xl shadow-[3px_3px_0px_#F43F5E]">
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-rose-500 text-white rounded-xl border-2 border-black dark:border-rose-300 shrink-0">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-sm sm:text-base leading-snug">{title}</p>
          {description && (
            <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed flex items-center gap-1.5 pt-1">
              <Terminal className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>{description}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
