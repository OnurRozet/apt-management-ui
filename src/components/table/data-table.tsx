"use client"

import { ReactNode } from "react"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  actionsHeader?: string
  renderActions?: (row: TData) => ReactNode
  pageCount?: number
  pagination: PaginationState
  onPaginationChange?: React.Dispatch<React.SetStateAction<PaginationState>>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  actionsHeader,
  renderActions,
  pageCount,
  pagination,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
   data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, 
    pageCount: pageCount, 
    state: {
      pagination, 
    },
    onPaginationChange: onPaginationChange,
  })

  const showActions = !!renderActions

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
                {showActions && (
                  <TableHead className="w-30 text-right">
                    {actionsHeader ?? "Aksiyonlar"}
                  </TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {showActions && renderActions && (
                    <TableCell className="text-right space-x-1">
                      {renderActions(row.original)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Bileşenini Bağlıyoruz */}
      <DataTablePagination table={table} />
    </div>
  );
}