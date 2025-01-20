import ActionsEllipses, { CellAction } from "@/components/TableActionEllipses";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/utils/bytes";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Star } from "lucide-react";

export type SummaryUnit = {
  createdAt: string;
  updatedAt: string;
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
    accessorKey: "createdAt",
    header: "Created At",
    accessorFn: ({ createdAt }) => {
      return new Date(createdAt).toLocaleString();
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Update",
    accessorFn: ({ updatedAt }) => {
      return new Date(updatedAt).toLocaleString();
    },
  },
  {
    accessorKey: "repo",
    header: "Repository",
    cell: ({ getValue }) => {
      return (
        <Badge variant="secondary" className="text-nowrap">
          {getValue() as React.ReactNode}
        </Badge>
      );
    },
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
    cell: ({ getValue }) => {
      return (
        <div
          className={
            (cn({
              "font-semibold": getValue() !== "-",
            }),
            "flex items-center")
          }
        >
          {getValue() as React.ReactNode}
          <Star className="h-4 w-4 ml-1" color="hsl(var(--chart-3))" />
        </div>
      );
    },
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
    cell: ({ getValue }) => {
      return (
        <div
          className={cn({
            "text-chart-3 font-semibold text-ellipsis overflow-hidden":
              getValue() !== "-",
          })}
        >
          {getValue() as React.ReactNode}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    enableSorting: false,
    meta: {
      sortable: false,
    },
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        setTargetRow: (row: any) => void;
      };

      const actions: CellAction[] = [
        {
          callback: () => meta.setTargetRow(row.original),
          title: "See details",
          disabled: false,
          icon: <Eye />,
        },
      ];

      return <ActionsEllipses actions={actions} />;
    },
  },
];
