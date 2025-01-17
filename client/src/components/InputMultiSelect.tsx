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
import { Checkbox } from "./ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

interface InputMultiSelectProps {
  options: string[];
  onCheckChange: (checked: boolean, repo: string) => void;
  selectionMap: Record<string, boolean>;
  placeholder: string;
  label?: string;
}

export default function InputMultiSelect({
  onCheckChange,
  options,
  placeholder,
  label,
  selectionMap,
}: InputMultiSelectProps) {
  const [openState, setOpenState] = React.useState<boolean>(false);

  function handleCheckChange(checked: CheckedState, repo: string) {
    onCheckChange(!!checked, repo);
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
            {placeholder}
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
                <CommandItem key={option} value={option}>
                  <div className="flex space-x-3 items-center">
                    <Checkbox
                      id={option}
                      className="border-primary/70"
                      onCheckedChange={(checked) =>
                        handleCheckChange(checked, option)
                      }
                      checked={selectionMap[option]}
                    />
                    <p>{option}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
