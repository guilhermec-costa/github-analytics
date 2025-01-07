import {
  CommitDetail,
  CommitFile,
  ParsedCommitDetails,
  RepoCommit,
} from "../../utils/types/commit";
import { RecursivePartial } from "../../utils/types/shared";
import * as moment from "moment";

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

  groupRepoCommitsByDate(commits: RepoCommit[]) {
    const groupedData: {
      [repo: string]: {
        count: number;
        details: ParsedCommitDetails[];
      };
    } = {};

    for (const commit of commits) {
      const innerCommit = commit.commit;
      const committedAt = moment
        .default(innerCommit.author.date)
        .format("YYYY-MM-DD");

      const commitDetail = this.extractCommitDetails(commit);

      if (!groupedData[committedAt]) {
        groupedData[committedAt] = {
          count: 1,
          details: [commitDetail],
        };
        continue;
      }

      groupedData[committedAt] = {
        count: groupedData[committedAt].count + 1,
        details: [commitDetail, ...groupedData[committedAt].details],
      };
    }

    return groupedData;
  }

  extractCommitDetails(commit: RepoCommit): ParsedCommitDetails {
    const innerCommit = commit.commit;
    return {
      sha: commit.sha,
      author: innerCommit.author.name,
      date: innerCommit.author.date,
      email: innerCommit.author.email,
      message: innerCommit.message,
    };
  }
}
