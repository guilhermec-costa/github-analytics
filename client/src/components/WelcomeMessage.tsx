import useLoggerUserInformation from "@/api/queries/useLoggedUserInformation";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function WelcomeMessage() {
  const { data } = useLoggerUserInformation();

  return (
    <Card className="rounded-md">
      <CardHeader className="bg-secondary">
        <CardTitle className="text-4xl font-bold break-words relative">
          <div className="md:flex md:space-x-4 md:items-center">
            <h2>
              Welcome to the Dashboard,{" "}
              <span className="text-chart-3">{data && data.name}</span>
            </h2>
          </div>
        </CardTitle>
        <CardDescription>
          View and manage GitHub repositories and metrics of any developer
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
