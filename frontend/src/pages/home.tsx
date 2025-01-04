import useUserInformation from "@/api/queries/useUserInformation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings } from "lucide-react";
import React from "react";
import RepositoriesMetrics from "@/features/repositories/components/RepositoriesMetrics";

export default function Home() {
  const userInfo = useUserInformation();

  const [username, setUsername] = React.useState<string>("");

  React.useEffect(() => {
    if (userInfo.status === "success") {
      setUsername(userInfo.data.name);
    }
  }, [userInfo]);

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
          Welcome to the Dashboard,{" "}
          <span className="text-muted-foreground">{username}</span>
        </h1>
        <RepositoriesMetrics sectionId={"repository-languages"} />
      </div>
    </div>
  );
}
