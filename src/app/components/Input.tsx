interface InputProps {
  title: string;
  placeholder: string;
}

export default function Input({ title, placeholder }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-black text-2xl">{title}</h1>
      <input
        className="bg-neutral-300 rounded-lg placeholder:text-zinc-700 text-black p-3 text-xl"
        type="text"
        name=""
        id=""
        placeholder={placeholder}
      />
    </div>
  );
}
