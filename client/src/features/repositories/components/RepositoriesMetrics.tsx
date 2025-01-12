import React, { SyntheticEvent } from "react";
import { MetricUnit, RepoMeasureDimension } from "@/utils/types";
import { DetailedRepoCommit } from "shared/types";
import useRepositoriesMetrics from "@/api/queries/useRepositoriesMetrics";
import {
  AreaChartIcon as ChartArea,
  Code,
  Database,
  RefreshCcw,
  Search,
  Star,
} from "lucide-react";
import { RepoAnalyser } from "../services/RepoAnalyser";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import LanguageChart from "./LanguageChart";
import CommitChart from "./CommitChart";
import InputSelect from "@/components/InputSelect";
import DimensionSelect from "./DimensionSelect";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { GithubUserService } from "@/services/githubUserService";
import useUserInformation from "@/api/queries/useUserInformation";
import MetricCard from "@/components/MetricCard";

export default function RepositoriesMetrics({
  sectionId,
}: {
  sectionId: string;
}) {
  const [searchUser, setSearchUser] = React.useState<string>("");
  const userInfo = useUserInformation();
  const { data, isLoading, isError } = useRepositoriesMetrics(
    searchUser || undefined,
  );

  const queryClient = useQueryClient();
  const targetUserRef = React.useRef<HTMLInputElement>(null);
  const [selectedMetric, setSelectedMetric] = React.useState<MetricUnit>();
  const [selectedDimension, setSelectedDimension] = React.useState<string>(
    RepoMeasureDimension.bytes,
  );
  const [selectedDetailedCommitPeriod, setDetailedCommitPeriod] =
    React.useState<DetailedRepoCommit>();
  const [selectedRepository, setSelectedRepository] = React.useState<string>();
  const [commitCount, setCommitCount] = React.useState<number>(0);
  const [topLanguage, setTopLanguage] = React.useState<string>("");
  const [averageRepoSize, setAverageRepoSize] = React.useState<string>("");
  const [repoSearchInputOpen, setRepoSearchInputOpen] =
    React.useState<boolean>(false);
  const [topStargazers, setTopStargazers] = React.useState<string | undefined>(
    "",
  );

  React.useEffect(() => {
    if (userInfo.data?.login) {
      setSearchUser(userInfo.data.login);
    }
  }, [userInfo.data]);

  React.useEffect(() => {
    if (data) {
      const values = Object.values(data);
      setCommitCount(RepoAnalyser.sumCommits(values));
      setTopLanguage(RepoAnalyser.findTopLanguage(values));
      setAverageRepoSize(RepoAnalyser.calcAvgRepoSize(values));
      setTopStargazers(RepoAnalyser.findTopStargazer(values));
    }
  }, [data]);

  async function handleUserSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (targetUserRef.current?.value) {
        const newUser = await GithubUserService.getSpecificUser(
          targetUserRef.current?.value,
          localStorage.getItem("accessToken")!,
        );
        if (newUser) {
          setSearchUser(newUser.login);
        }
      }
    }
  }

  if (isLoading) return <RepositoriesMetricsSkeleton />;
  if (isError) return <RepositoriesMetricsError />;

  const repositoryCount = Object.keys(data || {}).length;

  function handleMetricChange(repo: string) {
    setSelectedMetric(data![repo]);
    setDetailedCommitPeriod(undefined);
    setSelectedRepository(repo);
    setRepoSearchInputOpen(false);
  }

  function handleRefetch() {
    queryClient.invalidateQueries({ queryKey: ["repoMetrics"] });
  }

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
        <Button
          variant={"secondary"}
          className="flex w-fit justify-self-end"
          onClick={handleRefetch}
        >
          <p>Refresh data</p>
          <RefreshCcw />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Total repositories:{" "}
            <span className="font-medium">{repositoryCount}</span>
          </p>
          <div className="flex space-x-4">
            <div className="relative">
              <Input
                placeholder="Type username"
                type="text"
                ref={targetUserRef}
                onKeyDown={handleUserSearch}
                className="relative"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2"
                size={15}
                opacity="50%"
              />
            </div>
            {data && (
              <InputSelect
                options={Object.keys(data)}
                onSelectionChange={handleMetricChange}
                openState={repoSearchInputOpen}
                setOpenState={setRepoSearchInputOpen}
                selectedOption={selectedRepository}
              />
            )}
            <DimensionSelect setSelectedDimension={setSelectedDimension} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<ChartArea className="h-4 w-4" />}
            title="Total Commits"
            value={commitCount.toString()}
          />
          <MetricCard
            icon={<Code className="h-4 w-4" />}
            title="Top Language"
            value={topLanguage}
          />
          <MetricCard
            icon={<Database className="h-4 w-4" />}
            title={`Average Repo Size (${selectedDimension})`}
            value={averageRepoSize}
          />
          <MetricCard
            icon={<Star className="h-4 w-4" color="#fad900" fill="#fad900" />}
            title={`Top stargazers`}
            value={topStargazers}
          />
        </div>

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

function RepositoriesMetricsSkeleton() {
  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-[150px]" />
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[200px]" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

function RepositoriesMetricsError() {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        There was an error loading the repository metrics. Please try again
        later.
      </AlertDescription>
    </Alert>
  );
}
