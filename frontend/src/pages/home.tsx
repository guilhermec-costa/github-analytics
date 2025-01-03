import RepositoriesLanguages from "@/components/RepositoriesLanguages";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
      {/* <DashboardAnchors /> */}
      <Popover>
        <PopoverTrigger>
          <Settings className="absolute right-5 top-5 hover:cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent className="absolute right-5 top-5 hover:cursor-pointer">
          Place content for the popover here.
        </PopoverContent>
      </Popover>
      <div className="w-full max-w-screen-lg p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-6">
          Welcome to the Dashboard
        </h1>
        <RepositoriesLanguages sectionId={"repository-languages"} />
      </div>
    </div>
  );
}
