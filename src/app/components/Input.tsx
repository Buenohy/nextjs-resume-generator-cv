interface InputProps {
  title: string;
  placeholder: string;
}

export default function Input({ title, placeholder }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl text-black">{title}</h1>
      <input
        className="cursor-pointer rounded-lg bg-neutral-300 p-3 text-xl text-black placeholder:text-zinc-700"
        type="text"
        name=""
        id=""
        placeholder={placeholder}
      />
    </div>
  );
}
