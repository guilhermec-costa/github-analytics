import { Separator } from "@/components/ui/separator";
import WelcomeMessage from "@/components/WelcomeMessage";
import { RepositoriesMetrics } from "@/features/repositories";

export default function Main() {
  console.log("rendering main");
  return (
    <main className="container mx-auto border-2 border-secondary my-5 rounded-md mb-8 w-full">
      <WelcomeMessage />
      <Separator />
      <section id="repository-metrics">
        <RepositoriesMetrics sectionId="repository-metrics" />
      </section>
    </main>
  );
}
