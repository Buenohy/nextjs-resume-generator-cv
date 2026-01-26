import { ReactNode } from "react";
interface CardProps {
  title: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="flex h-fit min-w-72.5 flex-col gap-4 rounded-2xl bg-white p-4 sm:max-w-190">
      <h1 className="text-xl text-black">{title}</h1>
      {children}
    </div>
  );
}
