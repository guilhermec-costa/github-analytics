import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

interface InputSelectProps {
  options: string[];
  onSelectionChange: (value: any) => void;
  selectedOption?: string;
  openState: boolean;
  setOpenState: (state: boolean) => void;
}
export default function InputSelect({
  options,
  onSelectionChange,
  selectedOption,
  openState,
  setOpenState,
}: InputSelectProps) {
  return (
    <Popover open={openState} onOpenChange={setOpenState}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          className="w-[250px] justify-between"
        >
          {selectedOption
            ? options.find((option) => option === selectedOption)
            : "Select repository..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search repository..." className="h-9" />
          <CommandList>
            <CommandEmpty>No repository found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={onSelectionChange}
                >
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
