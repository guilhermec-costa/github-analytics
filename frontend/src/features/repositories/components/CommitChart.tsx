import { LanguageCount } from "@/utils/types";

export default function CommitChart({
  selectedRepository,
}: {
  selectedRepository: LanguageCount[];
}) {
  console.log(selectedRepository);
  return <h2>Commit chart</h2>;
}
