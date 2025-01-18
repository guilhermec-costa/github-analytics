import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Briefcase, Calendar, Link } from "lucide-react";
import { format } from "date-fns";
import { GithubUser } from "shared/types";

interface UserDetailSectionProps {
  targetUser?: GithubUser;
}

export default function UserDetailSection({
  targetUser,
}: UserDetailSectionProps) {
  if (!targetUser) return null;

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
          <AvatarImage
            src={targetUser.avatar_url}
            alt={targetUser.name || targetUser.login}
          />
          <AvatarFallback>
            {targetUser.login.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <CardTitle className="text-2xl sm:text-3xl">
            {targetUser.name || targetUser.login}
          </CardTitle>
          <p className="text-muted-foreground">@{targetUser.login}</p>
          {targetUser.hireable && <Badge className="mt-2">Hireable</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {targetUser.bio && (
          <p className="text-sm text-muted-foreground mb-4">{targetUser.bio}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {targetUser.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{targetUser.location}</span>
            </div>
          )}
          {targetUser.company && (
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span>{targetUser.company}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>Joined {format(targetUser.created_at, "LLLL, yyyy")}</span>
          </div>
          {targetUser.blog && (
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4 text-muted-foreground" />
              <a
                href={targetUser.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {targetUser.blog}
              </a>
            </div>
          )}
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{targetUser.public_repos}</p>
            <p className="text-sm text-muted-foreground">Repositories</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{targetUser.followers}</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{targetUser.following}</p>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{targetUser.public_gists}</p>
            <p className="text-sm text-muted-foreground">Gists</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
