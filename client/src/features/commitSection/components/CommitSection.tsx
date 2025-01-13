import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricUnit } from "@/utils/types";
import { DetailedRepoCommit } from "shared/types";
import React from "react";
import CommitOvertimeDashboard from "./CommitOvertimeDashboard";
import CommitSliderPresentation from "./CommitsSliderPresentation";
import ContributorsCommitDashboard from "./ContributorsCommitsDashboard";

export default function CommitSection({
  metric,
  selectedRepository,
  searchUser,
}: {
  metric: MetricUnit;
  selectedRepository: string;
  searchUser: string;
}) {
  const [selectedDetailedCommitPeriod, setDetailedCommitPeriod] =
    React.useState<DetailedRepoCommit>();

  React.useEffect(() => {
    setDetailedCommitPeriod(undefined);
  }, [metric]);

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
      {selectedDetailedCommitPeriod && selectedRepository && (
        <Card>
          <CardHeader>
            <CardTitle>
              Detailed Commits on {selectedDetailedCommitPeriod.date}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CommitSliderPresentation
              commitDetails={selectedDetailedCommitPeriod}
              selectedRepository={selectedRepository}
              username={searchUser}
            />
          </CardContent>
        </Card>
      )}
      <ContributorsCommitDashboard
        selectedRepo={selectedRepository}
        user={searchUser}
      />
    </Card>
  );
}
