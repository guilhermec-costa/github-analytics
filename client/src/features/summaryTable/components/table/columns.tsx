import { formatBytes } from "@/utils/bytes";
import { ColumnDef } from "@tanstack/react-table";

export type SummaryUnit = {
  repo: string;
  commits?: number;
  contributors?: number;
  stargazers?: number;
  watchers?: number;
  size?: number;
  license?: string | null;
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
  {
    accessorKey: "watchers",
    header: "Watchers",
  },
  {
    accessorKey: "size",
    header: "Size",
    accessorFn: ({ size }) => {
      return formatBytes(size ?? 0);
    },
  },
  {
    accessorKey: "license",
    header: "License",
    accessorFn: ({ license }) => {
      return license ?? "-";
    },
  },
];
