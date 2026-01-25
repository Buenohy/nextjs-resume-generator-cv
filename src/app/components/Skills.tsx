interface SkillsProps {
  title: string;
  placeholder: string;
}

export default function Skills({ title, placeholder }: SkillsProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-black text-2xl">{title}</h1>
      <div className="flex gap-2 items-center">
        <button
          className="text-black text-2xl bg-neutral-300 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
          type="button"
        >
          <span className="text-black text-2xl">+</span>
        </button>
        <input
          className="bg-neutral-300 rounded-lg placeholder:text-zinc-700 text-black p-3 text-xl cursor-pointer w-fit"
          type="text"
          name=""
          id=""
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
