import { Wifi, WifiOff, Globe, Server, CheckCircle2, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'loading' | 'success' | 'error';
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = {
    loading: {
      bg: 'bg-yellow-400 text-black border-black shadow-[2px_2px_0px_#000000]',
      icon: <Clock className="w-3.5 h-3.5 animate-spin" />,
    },
    error: {
      bg: 'bg-rose-400 text-black border-black shadow-[2px_2px_0px_#000000]',
      icon: <WifiOff className="w-3.5 h-3.5" />,
    },
    success: {
      bg: 'bg-emerald-400 text-black border-black shadow-[2px_2px_0px_#000000]',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
  };

  const { bg, icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase rounded-full border-2 ${bg}`}>
      {icon}
      <span>{label}</span>
    </span>
  );
}

interface ServiceInfoBadgeProps {
  type: 'gateway' | 'endpoint' | 'port';
  label: string;
}

export function ServiceInfoBadge({ type, label }: ServiceInfoBadgeProps) {
  const config = {
    gateway: {
      bg: 'bg-emerald-400 text-black border-black shadow-[2px_2px_0px_#000000]',
      icon: <Globe className="w-3.5 h-3.5" />,
    },
    endpoint: {
      bg: 'bg-sky-400 text-black border-black shadow-[2px_2px_0px_#000000]',
      icon: <Server className="w-3.5 h-3.5" />,
    },
    port: {
      bg: 'bg-purple-400 text-black border-black shadow-[2px_2px_0px_#000000]',
      icon: <Wifi className="w-3.5 h-3.5" />,
    },
  };

  const { bg, icon } = config[type];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase rounded-full border-2 ${bg}`}>
      {icon}
      <span>{label}</span>
    </span>
  );
}
