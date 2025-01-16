import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

interface InputSelectProps {
  options: string[];
  onSelectionChange: (value: any) => void;
  selectedOption?: string;
  placeholder: string;
  highlightSelected?: boolean;
  label?: string;
}

export default function InputSelect({
  options,
  onSelectionChange,
  selectedOption,
  placeholder,
  highlightSelected = true,
  label,
}: InputSelectProps) {
  const [openState, setOpenState] = React.useState<boolean>(false);

  function handleSelectionChange(value: unknown) {
    setOpenState(false);
    onSelectionChange(value);
  }

  return (
    <Popover open={openState} onOpenChange={setOpenState}>
      <PopoverTrigger>
        <div className="flex flex-col items-start space-y-3">
          <Label className="ml-2 text-foreground/70">{label}</Label>
          <Button
            variant="outline"
            role="combobox"
            className="w-[250px] justify-between"
          >
            {selectedOption
              ? options.find((option) => option === selectedOption)
              : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search repository..." className="h-9" />
          <CommandList>
            <CommandEmpty>No {placeholder} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={handleSelectionChange}
                  className={cn({
                    "bg-primary":
                      highlightSelected && option === selectedOption,
                    "flex items-center": true,
                  })}
                >
                  <p>{option}</p>
                  {option === selectedOption && <Check />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
