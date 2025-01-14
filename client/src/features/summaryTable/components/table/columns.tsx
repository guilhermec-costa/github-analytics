import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatBytes } from "@/utils/bytes";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

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
  {
    accessorKey: "actions",
    header: "Actions",
    enableSorting: false,
    meta: {
      sortable: false,
    },
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
