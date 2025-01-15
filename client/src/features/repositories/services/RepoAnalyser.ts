import { formatBytes } from "@/utils/bytes";
import { DetailedRepoCommit } from "shared/types";

export type Metric = {
  LanguageDetails: {
    language: string;
    count: number;
  }[];
  CommitDetails: DetailedRepoCommit[];
  StargazersCount?: number;
  repo?: string;
  watchersCount: number;
  size: number;
  licenseName?: string | null;
  updatedAt: string;
  createdAt: string;
  topLanguage: string;
};

export class RepoAnalyser {
  static sumCommits(metrics: Metric[]) {
    let commitSum = 0;

    for (const { CommitDetails } of metrics) {
      commitSum += this.sumCommitsForPeriod(CommitDetails);
    }

    return commitSum;
  }

  static sumCommitsForPeriod(commitPeriod: DetailedRepoCommit[]) {
    let commitSum = 0;
    commitSum += commitPeriod.reduce((acc: number, curValue) => {
      return (acc += curValue.commits);
    }, 0);

    return commitSum;
  }

  static findTopLanguage(metrics: Metric[]): string {
    const languageRank = metrics.reduce(
      (acc, curValue) => {
        const lang = curValue.topLanguage;
        if (!acc[lang]) {
          acc[lang] = 1;
        }

        acc[lang] += 1;

        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(languageRank).sort(
      (langA, langB) => langB[1] - langA[1],
    )[0][0];
  }

  static calcAvgRepoSize(metrics: Metric[]) {
    return formatBytes(
      metrics.reduce((acc, curValue) => (acc += curValue.size), 0),
    );
  }

  static findTopStargazer(metrics: Metric[]) {
    const topStargazer = metrics.sort(
      (mA, mB) => mB.StargazersCount! - mA.StargazersCount!,
    )[0];

    return {
      repo: topStargazer.repo,
      count: topStargazer.StargazersCount,
    };
  }
}
