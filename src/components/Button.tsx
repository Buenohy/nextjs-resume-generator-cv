import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { twMerge } from 'tailwind-merge';

const buttoVariants = tv({
  base: 'border cursor-pointer rounded-xl h-fit w-fit transition-all',
  variants: {
    variant: {
      light: [
        `bg-primary text-white dark:text-white`,
        `border-primary`,
        `hover:bg-primary/50 hover:text-white hover:border-primary/50`
      ],
      dark: [
        `bg-primary text-black dark:text-white`,
        `border-primary`,
        'hover:bg-primary/50 hover:text-black hover:border-primary/50 ',
      ] 
    },
    size: {
      sm: 'px-5 py-3.5',
      md: 'px-7.5 py-5',
      lg: 'px-10 py-7.5',
    },
    disabled: {
      true: 'cursor-not-allowed bg-primary/20 border-primary/20 hover:border-primary/20'
    }
  },
  compoundVariants: [
    {
      size: ['sm', 'md'],
      class: '',
    },
  ],
  defaultVariants: {
    size: 'sm',
    variant: 'light',
  },
});

interface ButtonProps extends VariantProps<typeof buttoVariants> {
  className?: string;
  children?: React.ReactNode;
}

export default function Text({
  variant,
  size,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        buttoVariants({ variant, size, disabled }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}