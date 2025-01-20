import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export type CellAction = {
  callback: () => void;
  disabled?: boolean;
  icon: any;
  title: string;
};

interface ActionsEllipsesProps {
  actions: Array<CellAction>;
}

export default function ActionsEllipses({ actions }: ActionsEllipsesProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Separator />
        {actions.map((action, i) => {
          return (
            <>
              <DropdownMenuItem
                key={i}
                className="cursor-pointer"
                onClick={action.callback}
                disabled={action?.disabled}
              >
                {action.icon}
                {action.title}
              </DropdownMenuItem>
            </>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
