import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { RepoMetrics } from "shared/types";
import { RepoAnalyser } from "@/features/repositories/services/RepoAnalyser";
import { SummaryUnit, columns } from "./components/table/columns";
import DataTable from "./components/table/DataTable";

interface SummaryDatatableProps {
  metrics?: RepoMetrics;
}

export default function SummaryDatatable({
  metrics,
}: SummaryDatatableProps): React.ReactNode {
  const data = React.useMemo(() => {
    if (!metrics) return [];

    const dataset: SummaryUnit[] = Object.values(metrics)
      .map(
        ({
          repo,
          CommitDetails,
          LanguageDetails,
          StargazersCount,
          watchersCount,
          size,
          licenseName,
          createdAt,
          updatedAt,
        }) => {
          return {
            repo,
            commits: RepoAnalyser.sumCommitsForPeriod(CommitDetails),
            contributors: 0,
            stargazers: StargazersCount,
            watchers: watchersCount,
            size,
            license: licenseName,
            createdAt,
            updatedAt,
          };
        },
      )
      .sort(
        (mA, mB) =>
          new Date(mB.updatedAt).getTime() - new Date(mA.updatedAt).getTime(),
      );
    return dataset;
  }, [metrics]);

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-2xl md:text-3xl font-bold">
          Summary
        </CardTitle>
        <CardDescription className="mt-2 text-sm md:text-base text-muted-foreground">
          A summary about all repositories
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-6 md:p-6">
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
