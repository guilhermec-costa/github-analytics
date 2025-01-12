import React from "react";
import { MetricUnit, RepoMeasureDimension } from "@/utils/types";
import { DetailedRepoCommit } from "shared/types";
import useRepositoriesMetrics from "@/api/queries/useRepositoriesMetrics";
import { RefreshCcw } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailedCommit from "./DetailedCommit";
import ContributorsDashboard from "./ContributorsDashboard";
import LanguageChart from "./LanguageChart";
import CommitChart from "./CommitChart";
import InputSelect from "@/components/InputSelect";
import DimensionSelect from "./DimensionSelect";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { GithubUserService } from "@/services/githubUserService";
import useUserInformation from "@/api/queries/useUserInformation";
import HighlightsPanel from "./HighlightsPanel";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import RepositoriesMetricsSkeleton from "./MetricsLoadingSkeleton";
import RepositoriesMetricsError from "./RepositoriesMetricsError";
import SearchInput from "@/components/SearchInput";

export default function RepositoriesMetrics({
  sectionId,
}: {
  sectionId: string;
}) {
  const { toast } = useToast();
  const [searchUser, setSearchUser] = React.useState<string>("");
  const userInfo = useUserInformation();
  const {
    data: metrics,
    isLoading,
    isError,
  } = useRepositoriesMetrics(searchUser || undefined);

  const queryClient = useQueryClient();
  const targetUserRef = React.useRef<HTMLInputElement>(null);
  const [selectedMetric, setSelectedMetric] = React.useState<MetricUnit>();
  const [selectedDimension, setSelectedDimension] = React.useState<string>(
    RepoMeasureDimension.bytes,
  );
  const [selectedDetailedCommitPeriod, setDetailedCommitPeriod] =
    React.useState<DetailedRepoCommit>();
  const [selectedRepository, setSelectedRepository] = React.useState<string>();
  const [repoSearchInputOpen, setRepoSearchInputOpen] =
    React.useState<boolean>(false);

  function resetMetric() {
    setSelectedRepository(undefined);
    setSelectedMetric(undefined);
  }

  React.useEffect(() => {
    if (userInfo.data?.login) {
      setSearchUser(userInfo.data.login);
    }
  }, [userInfo.data]);

  function handleMetricChange(repo: string) {
    setSelectedMetric(metrics![repo]);
    setDetailedCommitPeriod(undefined);
    setSelectedRepository(repo);
    setRepoSearchInputOpen(false);
  }

  function handleRefetch() {
    queryClient.invalidateQueries({ queryKey: ["repoMetrics", targetUserRef] });
  }

  async function handleUserSearch(username: string) {
    try {
      const newUser = await GithubUserService.getSpecificUser(
        username,
        localStorage.getItem("accessToken")!,
      );
      if (newUser) {
        setSearchUser(newUser.login);
        resetMetric();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch user",
        description: "The user does not exist",
        action: <ToastAction altText="Try again">Dismiss</ToastAction>,
      });
    }
  }

  if (isLoading) return <RepositoriesMetricsSkeleton />;
  if (isError) return <RepositoriesMetricsError />;

  const repositoryCount = Object.keys(metrics || {}).length;

  return (
    <Card id={sectionId} className="w-full rounded-none">
      <CardHeader className="grid grid-cols-1 md:grid-cols-2">
        <section>
          <CardTitle className="text-3xl font-bold">
            Repository Metrics
          </CardTitle>
          <CardDescription>
            Gain insights into your repositories with detailed metrics and data
            visualizations
          </CardDescription>
        </section>
        <div className="flex space-x-4 justify-self-end">
          <Button
            variant={"secondary"}
            className="flex w-fit"
            onClick={handleRefetch}
          >
            <p>Change to my data</p>
          </Button>
          <Button
            variant={"secondary"}
            className="flex w-fit"
            onClick={handleRefetch}
          >
            <p>Refresh data</p>
            <RefreshCcw />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Total repositories:{" "}
            <span className="font-medium">{repositoryCount}</span>
          </p>
          <div className="flex space-x-4">
            <SearchInput
              onSearch={handleUserSearch}
              placeholder={"Type username"}
            />
            {metrics && (
              <InputSelect
                options={Object.keys(metrics)}
                onSelectionChange={handleMetricChange}
                openState={repoSearchInputOpen}
                setOpenState={setRepoSearchInputOpen}
                selectedOption={selectedRepository}
              />
            )}
            <DimensionSelect setSelectedDimension={setSelectedDimension} />
          </div>
        </div>

        <HighlightsPanel
          metrics={metrics}
          selectedDimension={selectedDimension}
          targetUser={targetUserRef.current?.value}
        />

        {selectedMetric ? (
          <Tabs defaultValue="languages" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="languages">Language Breakdown</TabsTrigger>
              <TabsTrigger value="commits">Commit Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="languages">
              <Card>
                <CardContent>
                  <LanguageChart
                    metric={selectedMetric}
                    dimension={selectedDimension}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="commits">
              <Card>
                <CardHeader>
                  <CardTitle>Commit Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <CommitChart
                    metric={selectedMetric}
                    setDetailedCommitPeriod={setDetailedCommitPeriod}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="text-center py-6">
              Please select a repository to view its data.
            </CardContent>
          </Card>
        )}

        {selectedDetailedCommitPeriod && selectedRepository && (
          <Card>
            <CardHeader>
              <CardTitle>
                Detailed Commits on {selectedDetailedCommitPeriod.date}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DetailedCommit
                commitDetails={selectedDetailedCommitPeriod}
                selectedRepository={selectedRepository}
                username={searchUser}
              />
            </CardContent>
          </Card>
        )}

        {selectedRepository && (
          <ContributorsDashboard
            selectedRepo={selectedRepository}
            user={searchUser}
          />
        )}
      </CardContent>
    </Card>
  );
}
