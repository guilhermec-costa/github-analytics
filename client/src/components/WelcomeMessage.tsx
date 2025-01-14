import useUserInformation from "@/api/queries/useUserInformation";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function WelcomeMessage() {
  const { data } = useUserInformation();

  return (
    <Card className="rounded-md">
      <CardHeader className="bg-secondary">
        <CardTitle className="text-4xl font-bold break-words">
          <div className="flex space-x-4 items-center">
            Welcome to the Dashboard,
            <span className="bg-gradient-to-r from-red-600 to-orange-400 bg-clip-text text-transparent">
              {data && data.name}
            </span>
            <Avatar>
              <AvatarImage src={data?.avatar_url} alt="@shadcn" className="" />
              <AvatarFallback>User Avatar</AvatarFallback>
            </Avatar>
          </div>
        </CardTitle>
        <CardDescription>
          View and manage your GitHub repositories and metrics
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
