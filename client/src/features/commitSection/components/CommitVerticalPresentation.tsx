import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CommitDetailsDialog from "./CommitDetailsDialog";
import { ParsedCommitDetails } from "../../../../../server/src/utils/types/commit";
import useCommitPresentationLogic from "@/hooks/useCommitPresentationLogic";

interface CommitVerticalPresentationProps {
  commitDetails: Array<{
    repo: string;
    details: ParsedCommitDetails[];
  }>;
  username: string;
}

export default function CommitVerticalPresentation({
  commitDetails,
  username,
}: CommitVerticalPresentationProps) {
  const {
    deepViewCommit,
    handleCommitClick,
    loadingCommit,
    modalOpen,
    toggleDialog,
  } = useCommitPresentationLogic(username);

  return (
    <div className="bg-gradient-to-r from-background to-secondary rounded-lg shadow-xl p-4">
      <Dialog open={modalOpen} onOpenChange={toggleDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Commit Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected commit.
            </DialogDescription>
          </DialogHeader>
          {deepViewCommit && <CommitDetailsDialog commit={deepViewCommit} />}
        </DialogContent>
      </Dialog>

      <ScrollArea className="h-[500px] w-full pr-4 commit-vertical">
        <div className="space-y-4">
          {commitDetails.flatMap((detail) =>
            detail.details.map((commit) => (
              <Card
                key={commit.sha}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  loadingCommit != null && loadingCommit === commit.sha
                    ? "animate-pulse"
                    : ""
                }`}
                onClick={() =>
                  handleCommitClick({ ...commit, repo: detail.repo })
                }
              >
                <CardContent className="p-4">
                  <h3
                    className="text-sm font-semibold mb-2 truncate"
                    title={commit.message}
                  >
                    {commit.message}
                  </h3>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{commit.author}</span>
                    <span>{new Date(commit.date).toLocaleDateString()}</span>
                  </div>
                  <span className="text-sm font-semibold mt-2 block overflow-hidden text-muted-foreground">
                    Repository: {detail.repo}
                  </span>
                </CardContent>
              </Card>
            )),
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
