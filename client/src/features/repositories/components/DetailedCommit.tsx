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
import React from "react";
import { DeepViewCommit } from "@/utils/types";
import { DetailedRepoCommit } from "shared/types";
import useCommitDetails from "@/api/queries/useCommitDetails";
import { ParsedCommitDetails } from "../../../../../server/src/utils/types/commit";

export default function DetailedCommit({
  commitDetails,
  selectedRepository,
}: {
  commitDetails: DetailedRepoCommit;
  selectedRepository: string;
}) {
  const [deepViewCommit, setDeepViewCommit] =
    React.useState<DeepViewCommit | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedCommit, setSelectedCommit] =
    React.useState<ParsedCommitDetails | null>();

  const [commitLoadings, setCommitLoadings] = React.useState<
    Record<string, boolean>
  >({});

  const { data, isLoading, error } = useCommitDetails(
    selectedRepository,
    selectedCommit!,
  );

  React.useEffect(() => {
    console.log(commitLoadings);
  }, [commitLoadings]);
  React.useEffect(() => {
    if (selectedCommit) {
      setCommitLoadings((prevStates) => ({
        ...prevStates,
        [selectedCommit.sha]: isLoading,
      }));
    }
  }, [isLoading, selectedCommit]);

  const handleCommitClick = (commit: ParsedCommitDetails) => {
    setSelectedCommit(commit);
    if (!commitLoadings[commit.sha]) {
      setDeepViewCommit(null);
      setModalOpen(false);
    }
  };

  React.useEffect(() => {
    if (selectedCommit && !isLoading && data) {
      setDeepViewCommit({
        author: selectedCommit.author,
        date: selectedCommit.date,
        email: selectedCommit.email,
        files: data?.files || [],
        message: selectedCommit.message,
        sha: selectedCommit.sha,
        stats: data?.stats || null,
      });
      setModalOpen(true);
    }
  }, [isLoading, selectedCommit, data]);

  return (
    <div className="p-6 bg-gradient-to-r from-background from-20% to-secondary to-80% rounded-lg shadow-xl">
      <Dialog
        open={modalOpen}
        onOpenChange={(prev) => {
          if (!prev) {
            setSelectedCommit(null);
          }
          setModalOpen(prev);
        }}
      >
        <DialogContent className="p-8 bg-white rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Commit Details
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              View detailed information about the selected commit.
            </DialogDescription>
          </DialogHeader>

          {deepViewCommit && (
            <div className="space-y-6">
              <div className="text-lg font-semibold">Commit Information</div>
              <div className="space-y-3">
                <p>
                  <strong className="font-medium">Author:</strong>{" "}
                  {deepViewCommit.author}
                </p>
                <p>
                  <strong className="font-medium">Date:</strong>
                  {new Date(deepViewCommit.date).toLocaleString()}
                </p>
                <p>
                  <strong className="font-medium">Email:</strong>{" "}
                  {deepViewCommit.email}
                </p>
                <p>
                  <strong className="font-medium">Message:</strong>{" "}
                  {deepViewCommit.message}
                </p>
                <p>
                  <strong className="font-medium">SHA:</strong>{" "}
                  {deepViewCommit.sha}
                </p>
              </div>

              <div className="text-lg font-semibold">Files Modified</div>
              <Carousel>
                <CarouselContent className="">
                  {deepViewCommit.files.map((file) => (
                    <CarouselItem
                      key={file.filename}
                      className="space-y-4 w-[30px]"
                    >
                      <Card className="rounded-lg shadow-lg bg-">
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-2">
                            <p className="text-lg font-medium break-words">
                              {file.filename}
                            </p>
                            <p className="text-sm text-gray-600">
                              Status: {file.status}
                            </p>
                            <p className="text-sm text-gray-500">
                              Additions:{" "}
                              <span className="text-green-500 ">
                                {file.additions}+
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Deletions:{" "}
                              <span className="text-red-500">
                                {file.deletions}-
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Changes: {file.changes}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="text-gray-600 hover:text-black" />
                <CarouselNext className="text-gray-600 hover:text-black" />
              </Carousel>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Carousel>
        <CarouselContent>
          {commitDetails.details.map((commit) => {
            const { author, date, email, message, sha } = commit;
            const localLoading = commitLoadings[sha] || false;

            return (
              <CarouselItem
                key={sha}
                className="md:basis-1/2 lg:basis-1/3"
                onClick={() => handleCommitClick(commit)}
              >
                <div className="p-2">
                  {localLoading ? (
                    <div className="rounded-lg overflow-hidden shadow-lg bg-gray-200 p-6 animate-pulse">
                      <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                    </div>
                  ) : (
                    <Card className="rounded-lg overflow-hidden shadow-lg transition-transform transform hover:cursor-pointer hover:scale-105 hover:shadow-xl bg-gradient-to-r from-blue-50 to-blue-100">
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold text-background">
                              {author}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(date).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">{email}</p>
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold">Message:</span>{" "}
                            {message}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            <span className="font-semibold">SHA:</span> {sha}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
