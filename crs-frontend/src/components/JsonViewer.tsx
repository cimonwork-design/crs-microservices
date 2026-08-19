import { Code2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface JsonViewerProps {
  data: unknown;
  title?: string;
}

export function JsonViewer({ data, title = 'Dữ Liệu JSON Phản Hồi Từ Gateway' }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
          <Code2 className="w-4 h-4 text-yellow-500" />
          <span>{title}</span>
        </h4>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-zinc-100 hover:bg-yellow-400 hover:text-black dark:bg-zinc-800 dark:hover:bg-yellow-400 dark:hover:text-black text-zinc-900 dark:text-zinc-100 border-2 border-black dark:border-zinc-600 rounded-lg transition-all cursor-pointer shadow-[2px_2px_0px_#000000]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Đã sao chép</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép JSON</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap text-zinc-800 dark:text-zinc-200 leading-relaxed max-h-72">
          {jsonString}
        </pre>
      </div>
    </div>
  );
}
