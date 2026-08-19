import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="gap-2 cursor-pointer font-mono font-bold"
      title={theme === 'dark' ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
      aria-label="Chuyển đổi giao diện"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-3.5 h-3.5 text-yellow-400" />
          <span>SÁNG</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-purple-600" />
          <span>TỐI</span>
        </>
      )}
    </Button>
  );
}
