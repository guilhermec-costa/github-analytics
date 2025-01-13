import { Github } from "lucide-react";
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
import { Footer } from "@/layouts/Footer";

export default function Home() {
  const { data, status } = useUserInformation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background from-25% via-secondary via-50% to-card to-80%">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <TopNav />
        </div>
      </header>
      <main className="container mx-auto border-2 border-secondary my-5 rounded-md">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="text-4xl font-bold break-words">
              Welcome to the Dashboard,
              {status === "success" && (
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
                  {data.name}
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
      <Footer />
    </div>
  );
}
