import { DetailedRepoCommit } from "shared/types";

export type Metric = {
  LanguageDetails: {
    language: string;
    count: number;
  }[];
  CommitDetails: DetailedRepoCommit[];
  StargazersCount?: number;
  repo?: string;
};

export class RepoAnalyser {
  static sumCommits(metrics: Metric[]) {
    let commitSum = 0;

    for (const { CommitDetails } of metrics) {
      commitSum += CommitDetails.reduce((acc: number, curValue) => {
        return (acc += curValue.commits);
      }, 0);
    }

    return commitSum;
  }

  static findTopLanguage(metrics: Metric[]): string {
    const languageBytes: Record<string, number> = {};
    for (const { LanguageDetails } of metrics) {
      for (const { language, count } of LanguageDetails) {
        if (!languageBytes[language]) {
          languageBytes[language] = count;
          continue;
        }

        languageBytes[language] += count;
      }
    }

    const sortedLanguages = Object.entries(languageBytes).sort(
      (objA, objB) => objB[1] - objA[1],
    );

    return sortedLanguages[0][0] ?? "Not language";
  }

  static calcAvgRepoSize(metrics: Metric[]) {
    const languageBytes: Record<string, number> = {};
    for (const { LanguageDetails } of metrics) {
      for (const { language, count } of LanguageDetails) {
        if (!languageBytes[language]) {
          languageBytes[language] = count;
          continue;
        }

        languageBytes[language] += count;
      }
    }

    const languageCounts = Object.entries(languageBytes);
    const bytesSum = languageCounts.reduce((acc, currValue) => {
      return (acc += currValue[1]);
    }, 0);

    return (bytesSum / languageCounts.length).toFixed(2);
  }

  static findTopStargazer(metrics: Metric[]) {
    const topStargazer = metrics.sort(
      (mA, mB) => mB.StargazersCount! - mA.StargazersCount!,
    )[0].repo;

    return topStargazer;
  }
}
