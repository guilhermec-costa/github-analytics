import { GithubUser } from "shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Briefcase,
  Calendar,
  Users,
  Book,
  Link,
  ChartArea,
  ChartNoAxesCombined,
} from "lucide-react";

interface UserDetailSectionProps {
  info?: GithubUser;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function UserDetailSection({ info }: UserDetailSectionProps) {
  if (!info) return null;

  return (
    <Card className="w-full max-w-3xl mx-auto bg-secondary/40 shadow-xl border-2 border-solid border-secondary">
      <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
          <AvatarImage src={info.avatar_url} alt={info.name || info.login} />
          <AvatarFallback>
            {info.login.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <CardTitle className="text-2xl sm:text-3xl">
            {info.name || info.login}
          </CardTitle>
          <p className="text-muted-foreground">@{info.login}</p>
          {info.hireable && <Badge className="mt-2 bg-primary">Hireable</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {info.bio && (
          <p className="text-sm text-muted-foreground mb-4">{info.bio}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Profile Information</h3>
            <div className="grid grid-cols-1 gap-3">
              {info.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{info.location}</span>
                </div>
              )}
              {info.company && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span>{info.company}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Joined {formatDate(info.created_at)}</span>
              </div>
              {info.blog && (
                <div className="flex items-center gap-2">
                  <Link className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={info.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {info.blog}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>
                  {info.followers} followers · {info.following} following
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex space-x-3">
              <h3 className="text-lg font-semibold flex">GitHub Stats</h3>
              <ChartNoAxesCombined color="hsl(var(--chart-4))" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">{info.public_repos}</p>
                <p className="text-sm text-muted-foreground">Repositories</p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">{info.public_gists}</p>
                <p className="text-sm text-muted-foreground">Gists</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Recent Activity</h4>
              <p className="text-sm text-muted-foreground">
                Last updated: {formatDate(info.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
