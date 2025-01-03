import RepositoriesLanguages from "@/components/RepositoriesLanguages";

export default function Home() {
  console.log("rendering home");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
      <div className="w-full max-w-screen-lg p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-6">
          Welcome to the Dashboard
        </h1>
        <RepositoriesLanguages />
      </div>
    </div>
  );
}
