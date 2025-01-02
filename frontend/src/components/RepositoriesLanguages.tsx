import useRepositoriesLangugaes from "@/api/queries/useRepositoriesLanguages";

export default function RepositoriesLanguages() {
  const { data, isLoading, isError } = useRepositoriesLangugaes();

  if (isLoading) return <h2>Loading repositories...</h2>;
  if (isError) return <h2>Failed to fetch repositories</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Repositórios do Usuário</h1>
      <ul>
        {data?.data.map((repo, index) => <li key={index}>{repo.repoName}</li>)}
      </ul>
    </div>
  );
}
