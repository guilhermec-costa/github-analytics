import useLocalStorage from "@/hooks/useLocalStorage";
import { BackendHttpClient } from "@/lib/http/BackendClient";
import { repositoryLanguage } from "@/utils/types";
import React from "react";

export default function RepositoriesLanguages() {
  const [repos, setRepos] = React.useState<repositoryLanguage[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const { storedValue: storedUsername } = useLocalStorage<string>("username");
  const { storedValue: accessToken } = useLocalStorage<string>("accessToken");

  React.useEffect(() => {
    async function getUserRepos() {
      try {
        const response = await BackendHttpClient.get(
          `repoLanguages/owner/${localStorage.getItem("username")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        setRepos(response.data);
      } catch (err) {
        console.error("Erro ao buscar repositórios:", err);
        setError("Não foi possível carregar os repositórios.");
      }
    }

    getUserRepos();
  }, [accessToken, storedUsername]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Repositórios do Usuário</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {repos.length === 0 && !error && <p>Carregando...</p>}
      <ul>
        {repos.map((repo, index) => (
          <li key={index}>{repo.repoName}</li>
        ))}
      </ul>
    </div>
  );
}
