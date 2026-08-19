import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-heading font-bold text-xs uppercase tracking-wider rounded-xl border-2 brutal-interactive select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none transition-all duration-150',
  {
    variants: {
      variant: {
        default:
          'bg-yellow-400 text-black border-black shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] dark:bg-yellow-400 dark:text-black dark:border-black dark:shadow-[3px_3px_0px_#000000]',
        primary:
          'bg-sky-400 text-black border-black shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] dark:bg-sky-400 dark:text-black dark:border-black dark:shadow-[3px_3px_0px_#000000]',
        secondary:
          'bg-pink-400 text-black border-black shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] dark:bg-pink-400 dark:text-black dark:border-black dark:shadow-[3px_3px_0px_#000000]',
        success:
          'bg-emerald-400 text-black border-black shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] dark:bg-emerald-400 dark:text-black dark:border-black dark:shadow-[3px_3px_0px_#000000]',
        destructive:
          'bg-rose-400 text-black border-black shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] dark:bg-rose-400 dark:text-black dark:border-black dark:shadow-[3px_3px_0px_#000000]',
        outline:
          'bg-white text-zinc-900 border-black shadow-[3px_3px_0px_#000000] hover:bg-zinc-100 hover:shadow-[5px_5px_0px_#000000] dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 dark:shadow-[3px_3px_0px_#FFE600] dark:hover:bg-zinc-800',
        ghost:
          'border-transparent shadow-none bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100',
      },
      size: {
        default: 'px-4 py-2 text-xs',
        sm: 'px-3 py-1.5 text-[11px]',
        lg: 'px-6 py-2.5 text-sm',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
