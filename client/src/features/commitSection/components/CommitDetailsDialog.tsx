import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { DeepViewCommit } from "@/utils/types";
import { Calendar, Mail, GitCommit, FileText, Plus, Minus } from "lucide-react";

interface CommitDetailsDialogProps {
  commit: DeepViewCommit;
}

export default function CommitDetailsDialog({
  commit,
}: CommitDetailsDialogProps) {
  return (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Commit Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <GitCommit className="h-4 w-4 text-muted-foreground" />
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Author
                  </dt>
                  <dd className="text-sm font-semibold">{commit.author}</dd>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Date
                  </dt>
                  <dd className="text-sm font-semibold">
                    {new Date(commit.date).toLocaleString()}
                  </dd>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Email
                  </dt>
                  <dd className="text-sm font-semibold">{commit.email}</dd>
                </div>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  SHA
                </dt>
                <dd className="text-sm font-mono break-all">{commit.sha}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Commit Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{commit.message}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Files Modified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg">
              <CarouselContent>
                {commit.files.map((file) => (
                  <CarouselItem
                    key={file.filename}
                    className="md:basis-1/2 lg:basis-1/3 pl-1"
                  >
                    <Card>
                      <CardContent className="p-4">
                        <h4
                          className="text-sm font-medium mb-2 truncate"
                          title={file.filename}
                        >
                          <FileText className="h-4 w-4 inline-block mr-1" />
                          {file.filename}
                        </h4>
                        <Separator className="my-2" />
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{file.status}</Badge>
                          <Badge
                            variant="secondary"
                            className="flex items-center"
                          >
                            <Plus className="h-3 w-3 mr-1 text-green-500" />
                            {file.additions}
                            <Minus className="h-3 w-3 ml-2 mr-1 text-red-500" />
                            {file.deletions}
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
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
