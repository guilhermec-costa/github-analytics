import { Table } from "@tanstack/react-table";

interface PaginationProps<TData> {
  table: Table<TData>;
}

export default function TablePaginationSummary<TData>({
  table,
}: PaginationProps<TData>) {
  return (
    <div>
      Showing{" "}
      {table.getState().pagination.pageIndex *
        table.getState().pagination.pageSize +
        1}{" "}
      to{" "}
      {Math.min(
        (table.getState().pagination.pageIndex + 1) *
          table.getState().pagination.pageSize,
        table.getFilteredRowModel().rows.length,
      )}{" "}
      of {table.getFilteredRowModel().rows.length} results
    </div>
  );
}
