import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, ChevronsUpDown, FilterX } from "lucide-react";
import TablePagination from "@/components/TablePagination";
import { cn } from "@/lib/utils";
import TablePaginationSummary from "@/components/TablePaginationSummary";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import RepoDetailDialog from "@/features/repositories/components/RepoDetailDialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [interactedRow, setInteractedRow] = React.useState<any | undefined>(
    undefined,
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    columnResizeMode: "onChange",
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    meta: {
      setTargetRow: (rowData: any) => {
        setInteractedRow(rowData);
      },
    },
  });

  function resetFilters() {
    setGlobalFilter("");
    setSorting([]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <section className="flex space-x-4">
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={resetFilters}
                  disabled={!globalFilter && !sorting.length}
                  className={cn({
                    "hover:cursor-pointer": globalFilter || sorting.length,
                    "hover:cursor-not-allowed":
                      !globalFilter && !sorting.length,
                  })}
                >
                  <FilterX />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear all selections</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </section>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(parseInt(value));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a page size" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((pageSize, idx) => {
              const defaultMessage = idx === 0 ? "(default)" : null;
              return (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  Show {pageSize}{" "}
                  <small className="text-muted-foreground ml-2">
                    {defaultMessage}
                  </small>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full overflow-auto rounded-md border mt-1 border-secondary border-solid border-opacity-[0.5]">
        <Table>
          <TableHeader className="bg-secondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-bold text-foreground py-3 px-4 relative"
                    style={{ width: `${header.getSize()}px` }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          {
                            "cursor-pointer select-none flex items-center":
                              header.column.getCanSort(),
                          },
                          "relative",
                        )}
                        onMouseDown={header.column.getToggleSortingHandler()}
                      >
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`resizer ${
                            header.column.getIsResizing() ? "isResizing" : ""
                          }`}
                        ></div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: <ChevronUp className="ml-2 h-4 w-4" />,
                          desc: <ChevronDown className="ml-2 h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ??
                          (header.column.getCanSort() && (
                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                          ))}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn({
                    "bg-secondary/40": idx % 2 !== 0,
                    "border-b border-secondary/20": true,
                  })}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          <TablePaginationSummary table={table} />
        </div>
        <TablePagination table={table} />
      </div>
      {interactedRow && (
        <RepoDetailDialog
          repoDetails={interactedRow}
          onClose={() => setInteractedRow(undefined)}
        />
      )}
    </div>
  );
}
