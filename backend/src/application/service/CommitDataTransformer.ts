import { CommitDetail, CommitFile } from "../../utils/types/commit";
import { RecursivePartial } from "../../utils/types/shared";

export class CommitDataTransformer {
  refineFilesInfo(commit: CommitDetail) {
    const parsedFiles: RecursivePartial<CommitFile>[] = [];
    for (const file of commit.files) {
      parsedFiles.push({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch,
      });
    }

    return parsedFiles;
  }
}
