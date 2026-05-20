import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { twMerge } from 'tailwind-merge';

const textVariants = tv({
  base: 'font-sans text-white dark:text-black',
  variants: {
    color: {
      primary: 'text-black dark:text-white',
      secondary: 'text-black dark:text-white',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
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

interface TextProps extends VariantProps<typeof textVariants> {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

export default function Text({
  as: Tag = 'span',
  color,
  size,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={twMerge(
        textVariants({ color, size }),
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}