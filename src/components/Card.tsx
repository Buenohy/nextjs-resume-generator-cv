import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { twMerge } from 'tailwind-merge';

const cardVariants = tv({
  base: 'border bg-transparent rounded-2xl w-full h-full',
  variants: {
    variant: {
      primary: 'border-primary',
      secondary: 'border-primary',
    },
    size: {
      sm: 'p-16',
      md: '',
      lg: '',
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
    variant: 'primary',
  },
});

interface CardProps extends VariantProps<typeof cardVariants> {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

export default function Card({
  as: Tag = 'div',
  variant,
  size,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Tag
      className={twMerge(
        cardVariants({ variant, size }),
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}