import { ScrollArea } from "@/components/ui/scroll-area";
import { CommitCount } from "@/utils/types";

export default function DetailedCommit({
  commitDetails,
}: {
  commitDetails: CommitCount;
}) {
  return (
    <div className="p-6 bg-muted rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-primary mb-6">
        Commit Details
      </h2>
      <ScrollArea className="h-[400px]">
        <ul className="space-y-4">
          {commitDetails.details.map((commit) => {
            const { author, date, email, message, sha } = commit;
            return (
              <li
                key={sha}
                className="p-5 bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-base font-medium text-foreground">
                      {author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{email}</p>
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Message:</span> {message}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    <span className="font-semibold">SHA:</span> {sha}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
}
