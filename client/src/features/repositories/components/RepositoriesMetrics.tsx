import React from "react";
import { MetricUnit } from "@/utils/types";
import useRepositoriesMetrics from "@/api/queries/useRepositoriesMetrics";
import { RefreshCcw, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputSelect from "@/components/InputSelect";
import { Button } from "@/components/ui/button";
import { GithubUserService } from "@/services/githubUserService";
import useUserInformation from "@/api/queries/useUserInformation";
import HighlightsPanel from "./HighlightsPanel";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import RepositoriesMetricsSkeleton from "../layout/MetricsLoadingSkeleton";
import RepositoriesMetricsError from "../layout/RepositoriesMetricsError";
import SearchInput from "@/components/SearchInput";
import LanguageSection from "@/features/languageSection";
import { CommitSection } from "@/features/commitSection";
import SummaryDatatable from "../../summaryTable/components/SummaryDatatable";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GithubUser } from "shared/types";

export default function RepositoriesMetrics({
  sectionId,
}: {
  sectionId: string;
}) {
  const { toast } = useToast();
  const [searchUser, setSearchUser] = React.useState<GithubUser | undefined>(
    undefined,
  );
  const userInfo = useUserInformation();
  const {
    data: metrics,
    isLoading,
    isError,
    refetch,
    dataUpdatedAt,
  } = useRepositoriesMetrics(searchUser?.login || undefined);

  const targetUserRef = React.useRef<HTMLInputElement>(null);
  const [selectedMetric, setSelectedMetric] = React.useState<MetricUnit>();
  const [selectedRepository, setSelectedRepository] = React.useState<string>();

  function resetMetric() {
    setSelectedRepository(undefined);
    setSelectedMetric(undefined);
  }

  React.useEffect(() => {
    console.log(searchUser);
  }, [searchUser]);

  React.useEffect(() => {
    if (userInfo.data?.login) {
      console.log(userInfo.data);
      setSearchUser(userInfo.data);
    }
  }, [userInfo.data]);

  function handleMetricChange(repo: string) {
    if (repo !== selectedRepository) {
      setSelectedMetric(metrics![repo]);
      setSelectedRepository(repo);
      return;
    }
    setSelectedMetric(undefined);
    setSelectedRepository("");
  }

  function viewAuthUserData() {
    if (userInfo.data?.login) {
      setSearchUser(userInfo.data);
      resetMetric();
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

  return (
    <Card id={sectionId} className="w-full rounded-none">
      <CardHeader className="grid grid-cols-1 md:grid-cols-2">
        <section>
          <CardTitle className="text-3xl font-bold">
            Repository Metrics
          </CardTitle>
          <CardDescription className="mt-2">
            Gain insights into your repositories with detailed metrics and data
            visualizations
          </CardDescription>
        </section>
        <div className="flex space-x-4 justify-self-end">
          <Button
            variant={"secondary"}
            className="flex w-fit"
            onClick={viewAuthUserData}
          >
            <p>View my data</p>
            <User />
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
        <div className="flex flex-col md:flex md:flex-row md:justify-between md:items-center">
          <section id="resume" className="space-y-2 flex flex-col">
            <section className="relative">
              <p className="text-sm text-muted-foreground flex items-center">
                Visualising metrics for:{" "}
                <span className="font-medium text-foreground">
                  {searchUser?.name}
                </span>
                <figure className="ml-3">
                  <Avatar>
                    <AvatarImage src={searchUser?.avatar_url} alt="@shadcn" />
                    <AvatarFallback>User Avatar</AvatarFallback>
                  </Avatar>
                </figure>
              </p>
            </section>
            <p className="text-sm text-muted-foreground">
              Last fetch time:{" "}
              <span className="font-medium text-foreground">
                {new Date(dataUpdatedAt).toLocaleString()}
              </span>
            </p>
          </section>
          <SearchInput
            onSearch={handleUserSearch}
            placeholder={"Search other user"}
            className="min-w-[250px]"
          />
        </div>

        <HighlightsPanel
          metrics={metrics}
          targetUser={targetUserRef.current?.value}
        />

        <SummaryDatatable metrics={metrics} />

        <Separator />

        <div className="md:flex md:space-x-4 md:items-center">
          {metrics && (
            <InputSelect
              options={Object.keys(metrics)}
              onSelectionChange={handleMetricChange}
              selectedOption={selectedRepository}
              placeholder="Select a repository"
            />
          )}
        </div>

        {selectedMetric ? (
          <Tabs defaultValue="languages" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="languages">Language Breakdown</TabsTrigger>
              <TabsTrigger value="commits">Commit Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="languages">
              <LanguageSection metric={selectedMetric} />
            </TabsContent>
            <TabsContent value="commits">
              {selectedRepository && (
                <>
                  <CommitSection
                    metric={selectedMetric}
                    selectedRepository={selectedRepository}
                    searchUser={searchUser?.login || ""}
                  />
                </>
              )}
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
