import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { twMerge } from 'tailwind-merge';

const inputTextVariants = tv({
  base: 'text-black dark:text-white border border-green-tertiary focus:border-green-secondary bg-transparent outline-none w-full h-screen',
  variants: {
    size: {
      sm: 'px-5 py-2.5',
      md: 'px-7.5 py-5',
      lg: 'px-10 py-7.5',
    },
    disabled: {
      true: 'pointer-events-none'
    }
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

interface InputTextProps extends VariantProps<typeof inputTextVariants> {
  className?: string;
  children?: React.ReactNode;
}

export default function InputText({
  size,
  disabled,
  className,
  children,
  ...props
}: InputTextProps) {
  return (
    <input
      className={twMerge(
        inputTextVariants({ size, disabled }),
        className
      )}
      {...props}
    >
      {children}
    </input>
  );
}