interface InputProps {
  label: string;
  placeholder: string;
}

export default function Input({ label, placeholder }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base text-black">{label}</label>
      <input
        className="cursor-pointer rounded-lg bg-neutral-300 p-3 text-sm text-black placeholder:text-zinc-700"
        type="text"
        name=""
        id=""
        placeholder={placeholder}
      />
    </div>
  );
}
