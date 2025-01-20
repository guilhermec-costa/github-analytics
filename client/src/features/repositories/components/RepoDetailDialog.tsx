import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  GitCommit,
  Users,
  Star,
  Eye,
  HardDrive,
  Scale,
  Calendar,
} from "lucide-react";
import { SummaryUnit } from "@/features/summaryTable/components/table/columns";

interface RepoDetailDialogProps {
  repoDetails: SummaryUnit | null;
  onClose: () => void;
}

export default function RepoDetailDialog({
  repoDetails,
  onClose,
}: RepoDetailDialogProps) {
  if (!repoDetails) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={!!repoDetails} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {repoDetails.repo}
          </DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <GitCommit className="w-4 h-4" />
              {repoDetails.commits} commits
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {repoDetails.contributors} contributors
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {repoDetails.stargazers} stars
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {repoDetails.watchers} watchers
            </Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-muted-foreground" />
              <span>Size: {repoDetails.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-muted-foreground" />
              <span>License: {repoDetails.license}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Created: {formatDate(repoDetails.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {formatDate(repoDetails.updatedAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
