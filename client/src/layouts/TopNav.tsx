import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeProvider";
import { Moon, Settings, Sun, Menu, LogOut } from "lucide-react";
import useClickOutside from "@/hooks/useClickOutside";
import { AuthService } from "@/services/AuthService";
import { useNavigate } from "react-router-dom";
import NavItem from "@/components/NavItem";
import { GithubUserService } from "@/services/GithubUserService";

export default function TopNav() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  function handleLogout() {
    AuthService.logout();
    navigate("/login");
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const mobileMenuToggleRef = useClickOutside<HTMLButtonElement>(() =>
    setIsMobileMenuOpen(false),
  );

  React.useEffect(() => {}, []);

  return (
    <header className="sticky top-0 right-0 left-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pr-10 pl-10">
      <div className="flex h-14 items-center w-full justify-between">
        <div className="mr-4 hidden md:flex md:space-x-4">
          <NavItem href="#repository-metrics">Repository Metrics</NavItem>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-20 bg-popover">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Settings className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={handleLogout}
              >
                Logout
                <LogOut />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            ref={mobileMenuToggleRef}
          >
            <Menu className="h-4 w-4" color="hsl(var(--muted-foreground))" />
            <span className="sr-only">Toggle mobile menu</span>
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <nav className="border-t md:hidden">
          <div className="container py-4">
            <ul className="space-y-4">
              <li>
                <NavItem href="#repository-metrics">Repository Metrics</NavItem>
              </li>
              <li>
                <NavItem href="#">Projects</NavItem>
              </li>
              <li>
                <NavItem href="#">Teams</NavItem>
              </li>
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}
