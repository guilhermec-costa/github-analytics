import { ColumnDef } from "@tanstack/react-table";

export type SummaryUnit = {
  repo: string;
  commits?: number;
  contributors?: number;
  stargazers?: number;
};

export const columns: ColumnDef<SummaryUnit>[] = [
  {
    accessorKey: "repo",
    header: "Repository",
  },
  {
    accessorKey: "commits",
    header: "Commits",
  },
  {
    accessorKey: "contributors",
    header: "Contributors",
  },
  {
    accessorKey: "stargazers",
    header: "Stargazers",
  },
];
