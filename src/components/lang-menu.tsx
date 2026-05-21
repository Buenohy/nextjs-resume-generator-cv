import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LangMenu() {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select a lang" />
      </SelectTrigger>
      <SelectContent position="item-aligned">
        <SelectGroup>
          <SelectLabel>Langs</SelectLabel>
          <SelectItem value="pt-br">pt-br</SelectItem>
          <SelectItem value="en-us">en-us</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
