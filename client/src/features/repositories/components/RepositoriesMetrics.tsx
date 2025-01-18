import React from "react";
import { MetricUnit } from "@/utils/types";
import useRepositoriesMetrics from "@/api/queries/useRepositoriesMetrics";
import { FilterX, RefreshCcw, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GithubUserService } from "@/services/GithubUserService";
import HighlightsPanel from "./HighlightsPanel";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import RepositoriesMetricsSkeleton from "../layout/MetricsLoadingSkeleton";
import RepositoriesMetricsError from "../layout/RepositoriesMetricsError";
import SearchInput from "@/components/SearchInput";
import LanguageSection from "@/features/languageSection";
import { CommitSection } from "@/features/commitSection";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GithubUser } from "shared/types";
import StargazersDashboard from "./StargazersDashboard";
import InputMultiSelect from "@/components/InputMultiSelect";
import SummaryDatatable from "@/features/summaryTable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserDetailSection from "./UserDetailSection";
import useLoggerUserInformation from "@/api/queries/useLoggedUserInformation";

export default function RepositoriesMetrics({
  sectionId,
}: {
  sectionId: string;
}) {
  const { toast } = useToast();
  const [searchUser, setSearchUser] = React.useState<GithubUser | undefined>(
    undefined,
  );

  const userInfo = useLoggerUserInformation();

  const {
    data: metrics,
    isLoading,
    isError,
    refetch,
    dataUpdatedAt,
  } = useRepositoriesMetrics(searchUser?.login);

  const [selectedMetrics, setSelectedMetrics] = React.useState<MetricUnit[]>();
  const [selectedReposMap, setSelectedReposMap] = React.useState<
    Record<string, boolean>
  >({});
  const [selectedRepos, setSelectedRepos] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (userInfo.data?.login) {
      setSearchUser(userInfo.data);
    }
  }, [userInfo.data]);

  function resetMetrics() {
    setSelectedRepos([]);
    setSelectedMetrics([]);
    const resetedMap = Array.from(Object.entries(selectedReposMap)).map(
      ([repo, _]) => [repo, false],
    );

    setSelectedReposMap(Object.fromEntries(resetedMap));
  }

  function handleReposSelection(checked: boolean, repo: string) {
    setSelectedReposMap((prev) => ({
      ...prev,
      [repo]: checked,
    }));
  }

  React.useEffect(() => {
    setSelectedRepos(
      Object.entries(selectedReposMap)
        .filter(([_, checked]) => checked)
        .map(([repo, _]) => repo),
    );
  }, [selectedReposMap]);

  React.useEffect(() => {
    if (metrics) {
      const _selectedMetrics = Object.entries(metrics)
        .filter(([repo, _]) => selectedRepos.includes(repo))
        .map((entry) => entry[1]);

      setSelectedMetrics(_selectedMetrics);
    }
  }, [selectedRepos, metrics]);

  function viewAuthUserData() {
    if (userInfo.data?.login) {
      setSearchUser(userInfo.data);
      resetMetrics();
    }
  }

  function handleRefetch() {
    refetch({});
    toast({
      title: "Refetch in progress",
      description: `Fetching the latest data for "${searchUser?.login}". Please wait...`,
      duration: 5000,
    });
  }

  async function handleUserSearch(username: string) {
    try {
      const newUser = await GithubUserService.getSpecificUser(
        username,
        localStorage.getItem("accessToken")!,
      );
      if (newUser) {
        setSearchUser(newUser);
        resetMetrics();
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
  return (
    <Card id={sectionId} className="w-full rounded-none p-3">
      <CardHeader>
        <CardContent>
          <UserDetailSection targetUser={searchUser} />
        </CardContent>
      </CardHeader>
      <Separator />
      <CardHeader className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center">
        <section>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Repository Metrics
          </CardTitle>
          <CardDescription className="mt-2 text-sm md:text-base">
            Gain insights into repositories with detailed metrics and data
            visualizations.
          </CardDescription>
        </section>
        <div className="flex flex-wrap justify-center md:justify-end gap-2">
          <Button
            variant="secondary"
            className="flex items-center space-x-2"
            onClick={viewAuthUserData}
          >
            <span>View my data</span>
            <User />
          </Button>
          <Button
            className="flex items-center space-x-2"
            onClick={handleRefetch}
          >
            <span>Refresh data</span>
            <RefreshCcw />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <section className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Last fetch time:{" "}
              <span className="font-medium text-foreground">
                {new Date(dataUpdatedAt).toLocaleString()}
              </span>
            </p>
          </section>
          <SearchInput
            onSearch={handleUserSearch}
            placeholder="Search other user"
            className="mt-4 md:mt-0 md:min-w-[250px]"
          />
        </div>
        {metrics && <HighlightsPanel metrics={metrics} />}
        <SummaryDatatable metrics={metrics} />
        <Separator />
        <StargazersDashboard metrics={metrics} />
        <Separator />
        <Card>
          <CardHeader className="p-2">
            <CardTitle>Repository Details</CardTitle>
            <CardDescription>
              Overview and detailed metrics of selected repositories.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              {metrics && (
                <section className="flex items-end space-x-2">
                  <InputMultiSelect
                    options={Object.keys(metrics)}
                    onCheckChange={handleReposSelection}
                    selectionMap={selectedReposMap}
                    placeholder="Select repositories"
                    label="Repositories"
                  />
                  <Button
                    onClick={resetMetrics}
                    disabled={!selectedRepos.length}
                    className="relative"
                  >
                    {selectedRepos.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="absolute top-[-8px] right-[-8px] rounded-full bg-chart-1 text-white w-5 h-5 flex items-center justify-center">
                              <small>{selectedRepos.length}</small>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-left">Visualising:</p>
                            {selectedRepos.map((repo) => (
                              <small className="block my-1 text-left">
                                {repo}
                              </small>
                            ))}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <FilterX />
                  </Button>
                </section>
              )}
            </div>
          </CardContent>
        </Card>
        {selectedMetrics?.length ? (
          <Tabs defaultValue="languages" className="w-full mt-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="languages">Language Breakdown</TabsTrigger>
              <TabsTrigger value="commits">Commit Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="languages">
              <LanguageSection metrics={selectedMetrics} />
            </TabsContent>
            <TabsContent value="commits">
              <CommitSection
                metrics={selectedMetrics}
                selectedRepos={selectedRepos}
                searchUser={searchUser?.login || ""}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="text-center py-6">
              Please select a repository to view its data.
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
