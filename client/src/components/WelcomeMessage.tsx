import useUserInformation from "@/api/queries/useUserInformation";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function WelcomeMessage() {
  const { data } = useUserInformation();

  return (
    <Card className="rounded-md">
      <CardHeader className="bg-secondary">
        <CardTitle className="text-4xl font-bold break-words">
          Welcome to the Dashboard,
          <span className="bg-gradient-to-r from-red-600 to-orange-400 bg-clip-text text-transparent">
            {data && data.name}
          </span>
        </CardTitle>
        <CardDescription>
          View and manage your GitHub repositories and metrics
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
