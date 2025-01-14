import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import DataTable from "./table/DataTable";
import { columns, SummaryUnit } from "./table/columns";
import { RepoMetrics } from "shared/types";
import { RepoAnalyser } from "@/features/repositories/services/RepoAnalyser";

interface SummaryDatatableProps {
  metrics?: RepoMetrics;
}

export default function SummaryDatatable({
  metrics,
}: SummaryDatatableProps): React.ReactNode {
  const data = React.useMemo(() => {
    if (!metrics) return [];

    const dataset: SummaryUnit[] = Object.values(metrics).map(
      ({ repo, CommitDetails, LanguageDetails, StargazersCount }) => {
        return {
          repo,
          commits: RepoAnalyser.sumCommitsForPeriod(CommitDetails),
          contributors: 0,
          stargazers: StargazersCount,
        };
      },
    );
    return dataset;
  }, [metrics]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Summary</CardTitle>
        <CardDescription className="mt-2">
          A summary about all repositories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
