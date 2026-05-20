import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { twMerge } from 'tailwind-merge';

const cardVariants = tv({
  base: 'text-white dark:text-black border bg-transparent w-full h-full',
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

interface CardProps extends VariantProps<typeof cardVariants> {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

export default function Card({
  as: Tag = 'div',
  color,
  size,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Tag
      className={twMerge(
        cardVariants({ color, size }),
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}