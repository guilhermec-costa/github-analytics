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
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useUserInformation from "@/api/queries/useUserInformation";
import { RepositoriesMetrics } from "@/features/repositories";
import { Separator } from "@/components/ui/separator";
import TopNav from "@/layouts/TopNav";

export default function Home() {
  const { data, status } = useUserInformation();

  const [username, setUsername] = React.useState<string>("");

  React.useEffect(() => {
    if (status === "success") {
      setUsername(data.name);
    }
  }, [data, status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background from-20% via-secondary via-50% to-card to-80%">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Github className="h-6 w-6" />
          </div>
          <TopNav />
        </div>
      </header>
      <main className="container mx-auto py-10">
        <Card className="rounded-md">
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
        <Separator />
        <section id="repository-metrics">
          <RepositoriesMetrics sectionId="repository-metrics" />
        </section>
      </main>
    </div>
  );
}
