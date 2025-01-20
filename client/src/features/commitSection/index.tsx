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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CommitVerticalPresentation from "./components/CommitVerticalPresentation";

interface CommitSectionProps {
  metrics: MetricUnit[];
  searchUser: string;
  selectedRepos: string[];
}

type CommitViewState = "HORIZONTAL_SLIDER" | "VERTICAL";

export default function CommitSection({
  searchUser,
  metrics,
  selectedRepos,
}: CommitSectionProps) {
  const [selectedDetailedCommitsPeriods, setDetailedCommitsPeriods] =
    React.useState<DetailedRepoCommit[]>();

  function commitViewToggleReducer(state: CommitViewState, _: any) {
    switch (state) {
      case "VERTICAL":
        return "HORIZONTAL_SLIDER";

      case "HORIZONTAL_SLIDER":
        return "VERTICAL";

      default:
        return state;
    }
  }

  const [commitViewState, dispatchCommitView] = React.useReducer(
    commitViewToggleReducer,
    "HORIZONTAL_SLIDER",
  );

  function getCommitView() {
    switch (commitViewState) {
      case "HORIZONTAL_SLIDER":
        return (
          <CommitSliderPresentation
            commitDetails={selectedDetailedCommitsPeriods!}
            selectedRepositories={selectedRepos}
            username={searchUser}
          />
        );

      case "VERTICAL": {
        return (
          <CommitVerticalPresentation
            commitDetails={selectedDetailedCommitsPeriods!}
            username={searchUser}
          />
        );
      }
      default:
        break;
    }
  }

  React.useEffect(() => {
    setDetailedCommitsPeriods(undefined);
  }, [metrics]);

  React.useEffect(() => {
    dispatchCommitView("HORIZONTAL_SLIDER");
    setDetailedCommitsPeriods(undefined);
  }, [selectedRepos]);

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
          setDetailedCommitsPeriods={setDetailedCommitsPeriods}
          searchUser={searchUser}
          metrics={metrics}
        />
      </CardContent>
      {!!selectedDetailedCommitsPeriods?.length && (
        <Card>
          <CardHeader>
            <CardTitle>
              Detailed Commit Insights for{" "}
              {selectedDetailedCommitsPeriods[0].date}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="change-commit-view"
                onCheckedChange={dispatchCommitView}
                defaultChecked={false}
                className="my-2"
              />
              <Label htmlFor="change-commit-view">Switch Commit View</Label>
            </div>
            {getCommitView()}
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader className="max-md:mt-[80px]">
          <CardTitle>Contributors' Commit Contributions</CardTitle>
          <CardDescription>
            Analyze the commit contributions of all contributors for the
            selected repository.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContributorsCommitDashboard
            selectedRepos={selectedRepos}
            user={searchUser}
          />
        </CardContent>
      </Card>
    </Card>
  );
}
