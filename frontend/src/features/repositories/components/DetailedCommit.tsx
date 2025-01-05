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
import { CommitCount, CommitDetail } from "@/utils/types";

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

      <Carousel>
        <CarouselContent>
          {commitDetails.details.map((commit) => {
            const { author, date, email, message, sha } = commit;
            return (
              <CarouselItem
                key={sha}
                className="md:basis-1/2 lg:basis-1/3"
                onClick={() => handleCommitClick(commit)}
              >
                <div className="p-2">
                  <Card className="rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-blue-50 to-blue-100">
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
