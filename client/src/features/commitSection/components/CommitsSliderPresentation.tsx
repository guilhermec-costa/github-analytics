import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeepViewCommit } from "@/utils/types";
import { DetailedRepoCommit } from "shared/types";
import useCommitDetails from "@/api/queries/useCommitDetails";
import { ParsedCommitDetails } from "../../../../../server/src/utils/types/commit";
import CommitDetailsDialog from "./CommitDetailsDialog";

interface CommitSliderPresentationProps {
  commitDetails: DetailedRepoCommit[];
  selectedRepositories: string[];
  username: string;
}
export default function CommitSliderPresentation({
  commitDetails,
  username,
}: CommitSliderPresentationProps) {
  const [deepViewCommit, setDeepViewCommit] =
    React.useState<DeepViewCommit | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedCommit, setSelectedCommit] =
    React.useState<ParsedCommitDetails | null>(null);
  const [loadingCommit, setLoadingCommit] = React.useState<string | null>(null);
  const [commitRepo, setCommitRepo] = React.useState<string>("");

  const { data, isLoading } = useCommitDetails(
    commitRepo,
    username,
    selectedCommit?.sha,
  );

  React.useEffect(() => {
    if (!isLoading) {
      setLoadingCommit(null);
    }
  }, [isLoading]);

  React.useEffect(() => {
    if (selectedCommit && data) {
      setDeepViewCommit({
        author: selectedCommit.author,
        date: selectedCommit.date,
        email: selectedCommit.email,
        files: data.files || [],
        message: selectedCommit.message,
        sha: selectedCommit.sha,
        stats: data.stats,
      });
    }
  }, [selectedCommit, data]);

  const handleCommitClick = (
    commit: ParsedCommitDetails & { repo: string },
  ) => {
    setSelectedCommit(commit);
    setCommitRepo(commit.repo);
    setLoadingCommit(commit.sha);
    setModalOpen(true);
  };

  function toggleDialog() {
    setModalOpen((prev) => !prev);
    setLoadingCommit(null);
    setDeepViewCommit(null);
  }
  return (
    <div className="bg-gradient-to-r from-background to-secondary rounded-lg shadow-xl">
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

      <Carousel className="w-full">
        <CarouselContent>
          {commitDetails
            .flatMap((detail) =>
              detail.details.map((commit) => ({
                ...commit,
                repo: detail.repo,
              })),
            )
            .map((commit) => (
              <CarouselItem
                key={commit.sha}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      loadingCommit != null && loadingCommit === commit.sha
                        ? "animate-pulse"
                        : ""
                    }`}
                    onClick={() => handleCommitClick(commit)}
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
                        <span>
                          {new Date(commit.date).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-sm font-semibold mb-2 overflow-hidden text-muted-foreground">
                        Repository: {commit.repo}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
