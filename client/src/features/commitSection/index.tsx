export { CommitSection };
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
import CommitOvertimeDashboard from "./components/CommitOvertimeDashboard";
import CommitSliderPresentation from "./components/CommitsSliderPresentation";
import ContributorsCommitDashboard from "./components/ContributorsCommitsDashboard";

interface CommitSectionProps {
  metric: MetricUnit;
  metrics: MetricUnit[];
  selectedRepository: string;
  searchUser: string;
}

export default function CommitSection({
  metric,
  selectedRepository,
  searchUser,
  metrics,
}: CommitSectionProps) {
  const [selectedDetailedCommitPeriod, setDetailedCommitPeriod] =
    React.useState<DetailedRepoCommit>();

  React.useEffect(() => {
    setDetailedCommitPeriod(undefined);
  }, [metric]);

  return (
    <Card className="mt-10">
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
          searchUser={searchUser}
          metrics={metrics}
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
