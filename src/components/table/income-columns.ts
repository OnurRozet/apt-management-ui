"use client"

import { Income } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

export const incomeColumns: ColumnDef<Income>[] = [
  {
    accessorKey: "incomeDate",
    header: "Tarih",
    cell: ({ row }) => {
      const value = row.getValue<string>("incomeDate")

      if (!value) return ""

      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value

      return date.toLocaleDateString("tr-TR")
    },
  },
  {
    accessorKey: "incomeCategory",
    header: "Gelir Kategorisi",
  },
  {
    accessorKey: "title",
    header: "Gelir Başlığı",
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

