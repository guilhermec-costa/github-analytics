import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommitCount, CommitDetail } from "@/utils/types";
import React from "react";

export default function DetailedCommit({
  commitDetails,
}: {
  commitDetails: CommitCount;
}) {
  const [deepViewCommit, setDeepViewCommit] =
    React.useState<CommitDetail | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleCommitClick = (commit: CommitDetail) => {
    setDeepViewCommit(commit);
    setModalOpen(true);
  };

  return (
    <div className="p-6 bg-secondary rounded-lg shadow-xl">
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Commit Details</DialogTitle>
            <DialogDescription>
              View details of the commit selected.
            </DialogDescription>
          </DialogHeader>
          {deepViewCommit && (
            <div className="space-y-4">
              <p>
                <strong>Author:</strong> {deepViewCommit.author}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(deepViewCommit.date).toLocaleString()}
              </p>
              <p>
                <strong>Email:</strong> {deepViewCommit.email}
              </p>
              <p>
                <strong>Message:</strong> {deepViewCommit.message}
              </p>
              <p>
                <strong>SHA:</strong> {deepViewCommit.sha}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ScrollArea className="h-[400px] caret-red-300">
        <ul className="space-y-4">
          {commitDetails.details.map((commit) => {
            const { author, date, email, message, sha } = commit;
            return (
              <li
                key={sha}
                className="p-5 bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow hover:cursor-pointer"
                onClick={() => handleCommitClick(commit)}
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
