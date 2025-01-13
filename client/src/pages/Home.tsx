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
  console.log("rendering home");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background from-25% via-secondary via-50% to-card to-80% relative w-full">
      <TopNav />
      <main className="container mx-auto border-2 border-secondary my-5 rounded-md mb-8 w-full">
        <Card className="rounded-md">
          <CardHeader className="bg-secondary">
            <CardTitle className="text-4xl font-bold break-words">
              Welcome to the Dashboard,
              {status === "success" && (
                <span className="bg-gradient-to-r from-red-600 to-orange-400 bg-clip-text text-transparent">
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
      <section className="h-10" />
      <Footer />
    </div>
  );
}
