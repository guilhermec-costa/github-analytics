"use client";

import React from "react";
import { Settings, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useUserInformation from "@/api/queries/useUserInformation";
import { RepositoriesMetrics } from "@/features/repositories";

export default function Home() {
  const { data, status } = useUserInformation();

  const [username, setUsername] = React.useState<string>("");

  React.useEffect(() => {
    if (status === "success") {
      setUsername(data.login);
    }
  }, [data, status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background from-20% via-secondary via-50% to-card to-80%">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Github className="h-6 w-6" />
          </div>
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
        </div>
      </header>
      <main className="container mx-auto py-10">
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">
              Welcome to the Dashboard
              {status === "success" && (
                <span className="bg-gradient-to-r from-cyan-500 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                  , {username}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              View and manage your GitHub repositories and metrics
            </CardDescription>
          </CardHeader>
        </Card>
        <section id="repository-metrics">
          <RepositoriesMetrics sectionId="repository-metrics" />
        </section>
      </main>
    </div>
  );
}
