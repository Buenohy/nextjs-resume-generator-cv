interface SkillsProps {
  title: string;
  placeholder: string;
}

export default function Skills({ title, placeholder }: SkillsProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl text-black">{title}</h1>
      <div className="flex items-center gap-2">
        <button
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-neutral-300 text-2xl text-black"
          type="button"
        >
          <span className="text-2xl text-black">+</span>
        </button>
        <input
          className="w-fit cursor-pointer rounded-lg bg-neutral-300 p-3 text-xl text-black placeholder:text-zinc-700"
          type="text"
          name=""
          id=""
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
