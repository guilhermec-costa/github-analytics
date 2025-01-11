import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";

export default function TopNav() {
  return (
    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <a
          href="#repository-metrics"
          className="transition-colors hover:text-foreground/80 text-foreground/60"
        >
          Repository Metrics
        </a>
        <a
          href="#"
          className="transition-colors hover:text-foreground/80 text-foreground/60"
        >
          Projects
        </a>
        <a
          href="#"
          className="transition-colors hover:text-foreground/80 text-foreground/60"
        >
          Teams
        </a>
      </nav>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
