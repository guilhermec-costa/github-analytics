import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommitOvertimeDashboard from "./components/CommitOvertimeDashboard";
import { MetricUnit } from "@/utils/types";
import { DetailedRepoCommit } from "shared/types";

export default function CommitSection({
  metric,
  setDetailedCommitPeriod,
}: {
  metric: MetricUnit;
  setDetailedCommitPeriod: (period: DetailedRepoCommit) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commit Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <CommitOvertimeDashboard
          metric={metric}
          setDetailedCommitPeriod={setDetailedCommitPeriod}
        />
      </CardContent>
    </Card>
  );
}
