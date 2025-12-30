"use client"

import { Expense } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "expenseDate",
    header: "Tarih",
    cell: ({ row }) => {
      const value = row.getValue<string>("expenseDate")

      if (!value) return ""

      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value

      return date.toLocaleDateString("tr-TR")
    },
  },
  {
    accessorKey: "expenseCategory",
    header: "Gider Kategorisi",
  },
  {
    accessorKey: "title",
    header: "Gider Başlığı",
  },
  {
    accessorKey: "amount",
    header: "Tutar",
    cell: ({ row }) => {
      const raw = row.getValue<unknown>("amount")
      const numeric =
        typeof raw === "number"
          ? raw
          : typeof raw === "string"
          ? Number(raw.replace(",", "."))
          : NaN

      if (Number.isNaN(numeric)) return raw as number | string

      return numeric.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },
  },
]