"use client"

import { ExpenseCategory } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

export const expenseCategoryColumns: ColumnDef<ExpenseCategory>[] = [
  {
    accessorKey: "name",
    header: "Kategori Adı",
  },
  {
    accessorKey: "description",
    header: "Açıklama",
    cell: ({ row }) => {
      const value = row.getValue<string>("description")
      return value || "-"
    },
  },
]

