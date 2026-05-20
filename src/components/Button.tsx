import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { twMerge } from 'tailwind-merge';

const buttoVariants = tv({
  base: 'text-white dark:text-black border bg-transparent',
  variants: {
    color: {
      primary: 'border-green-primary text-black dark:text-white hover:bg-green-primary hover:text-black',
      secondary: 'border-green-secondary text-black dark:text-white hover:bg-green-secondary hover:text-black',
    },
    size: {
      sm: 'px-5 py-2.5',
      md: 'px-7.5 py-5',
      lg: 'px-10 py-7.5',
    },
  },
  compoundVariants: [
    {
      size: ['sm', 'md'],
      class: '',
    },
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

interface ButtonProps extends VariantProps<typeof buttoVariants> {
  className?: string;
  children?: React.ReactNode;
}

export default function Text({
  color,
  size,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        buttoVariants({ color, size }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}