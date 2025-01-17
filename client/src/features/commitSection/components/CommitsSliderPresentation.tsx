import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

  const { data, isLoading, status } = useCommitDetails(
    commitRepo,
    username,
    selectedCommit?.sha,
  );

  React.useEffect(() => {
    if (!isLoading) {
      setLoadingCommit("");
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
    console.log("selected repo: ", commit.repo);
    setSelectedCommit(commit);
    setCommitRepo(commit.repo);
    setLoadingCommit(commit.sha);
    setModalOpen(true);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-background to-secondary rounded-lg shadow-xl">
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Commit Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected commit.
            </DialogDescription>
          </DialogHeader>

          {deepViewCommit && (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Author
                        </dt>
                        <dd className="text-sm font-semibold">
                          {deepViewCommit.author}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Date
                        </dt>
                        <dd className="text-sm font-semibold">
                          {new Date(deepViewCommit.date).toLocaleString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Email
                        </dt>
                        <dd className="text-sm font-semibold">
                          {deepViewCommit.email}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          SHA
                        </dt>
                        <dd className="text-sm font-mono">
                          {deepViewCommit.sha}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Commit Message
                    </h3>
                    <p className="text-sm">{deepViewCommit.message}</p>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Files Modified</h3>
                  <Carousel>
                    <CarouselContent>
                      {deepViewCommit.files.map((file) => (
                        <CarouselItem
                          key={file.filename}
                          className="md:basis-1/2 lg:basis-1/3"
                        >
                          <Card>
                            <CardContent className="p-4">
                              <h4
                                className="text-sm font-medium mb-2 truncate"
                                title={file.filename}
                              >
                                {file.filename}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">{file.status}</Badge>
                                <Badge variant="secondary">
                                  +{file.additions} -{file.deletions}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>
            </ScrollArea>
          )}
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
                      loadingCommit === commit.sha ? "animate-pulse" : ""
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
