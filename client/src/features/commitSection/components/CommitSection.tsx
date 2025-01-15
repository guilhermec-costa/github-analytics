import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <CardTitle>Commit Activity Overview</CardTitle>
        <CardDescription>
          Explore the commit activity over time for the selected repository.
          Click on a point in the chart to view more detailed information about
          the commits made on that day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CommitOvertimeDashboard
          commitsDetails={metric.CommitDetails}
          setDetailedCommitPeriod={setDetailedCommitPeriod}
          selectedRepository={selectedRepository}
        />
      </CardContent>
      {selectedDetailedCommitPeriod && selectedRepository && (
        <Card>
          <CardHeader>
            <CardTitle>
              Detailed Commit Insights for {selectedDetailedCommitPeriod.date}
            </CardTitle>
            <CardDescription>
              View detailed information about the commits made on{" "}
              {selectedDetailedCommitPeriod.date} in the repository{" "}
              <strong>{selectedRepository}</strong>.
            </CardDescription>
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
      <Card>
        <CardHeader>
          <CardTitle>Contributors' Commit Contributions</CardTitle>
          <CardDescription>
            Analyze the commit contributions of all contributors for the
            selected repository.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContributorsCommitDashboard
            selectedRepo={selectedRepository}
            user={searchUser}
          />
        </CardContent>
      </Card>
    </Card>
  );
}
