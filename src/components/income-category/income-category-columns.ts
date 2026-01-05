"use client"

import { IncomeCategory } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

export const incomeCategoryColumns: ColumnDef<IncomeCategory>[] = [
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

