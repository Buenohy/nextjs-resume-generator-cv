import { ReactNode } from 'react';
interface CardProps {
  title: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-2xl bg-white p-8 flex flex-col gap-4 min-w-190">
      <h1 className="text-black text-3xl">{title}</h1>
      {children}
    </div>
  );
}
