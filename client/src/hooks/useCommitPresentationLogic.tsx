import useCommitDetails from "@/api/queries/useCommitDetails";
import { DeepViewCommit } from "@/utils/types";
import React from "react";
import { ParsedCommitDetails } from "../../../server/src/utils/types/commit";

export default function useCommitPresentationLogic(username: string) {
  const [deepViewCommit, setDeepViewCommit] =
    React.useState<DeepViewCommit | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedCommit, setSelectedCommit] =
    React.useState<ParsedCommitDetails | null>(null);
  const [loadingCommit, setLoadingCommit] = React.useState<string | null>(null);
  const [commitRepo, setCommitRepo] = React.useState<string>("");

  const { data, isLoading } = useCommitDetails(
    commitRepo,
    username,
    selectedCommit?.sha,
  );

  React.useEffect(() => {
    if (!isLoading) {
      setLoadingCommit(null);
    }
  }, [isLoading]);

  React.useEffect(() => {
    if (selectedCommit && data) {
      setDeepViewCommit({
        author: selectedCommit.author,
        date: selectedCommit.date,
        email: selectedCommit.email,
        files: data.files || [],
        message: selectedCommit.message,
        sha: selectedCommit.sha,
        stats: data.stats,
      });
    }
  }, [selectedCommit, data]);

  const handleCommitClick = (
    commit: ParsedCommitDetails & { repo: string },
  ) => {
    setSelectedCommit(commit);
    setCommitRepo(commit.repo);
    setLoadingCommit(commit.sha);
    setModalOpen(true);
  };

  function toggleDialog() {
    setModalOpen((prev) => !prev);
    setLoadingCommit(null);
    setDeepViewCommit(null);
  }

  return {
    handleCommitClick,
    toggleDialog,
    deepViewCommit,
    loadingCommit,
    modalOpen,
    selectedCommit,
    setLoadingCommit,
    commitRepo,
    data,
  };
}
