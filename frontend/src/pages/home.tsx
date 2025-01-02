import RepositoriesLanguages from "@/components/RepositoriesLanguages";

export default function Home() {
  console.log("rendering home");
  return (
    <div style={{ padding: "20px" }}>
      <RepositoriesLanguages />
    </div>
  );
}
