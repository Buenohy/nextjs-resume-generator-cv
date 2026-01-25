import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return <div className="rounded-2xl bg-white p-8">{children}</div>;
}
