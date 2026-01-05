"use client"

import React from "react"
import { DuesSetting } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

export const duesSettingColumns: ColumnDef<DuesSetting>[] = [
  {
    accessorKey: "amount",
    header: "Tutar (₺)",
    cell: ({ row }) => {
      const amount = row.getValue<number>("amount")
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
      }).format(amount)
    },
  },
  {
    accessorKey: "startDate",
    header: "Başlangıç Tarihi",
    cell: ({ row }) => {
      const date = row.getValue<string>("startDate")
      return new Date(date).toLocaleDateString('tr-TR')
    },
  },
  {
    accessorKey: "endDate",
    header: "Bitiş Tarihi",
    cell: ({ row }) => {
      const date = row.getValue<string>("endDate")
      return new Date(date).toLocaleDateString('tr-TR')
    },
  },
  {
    accessorKey: "description",
    header: "Açıklama",
    cell: ({ row }) => {
      const value = row.getValue<string>("description")
      return value || "-"
    },
  },
  {
    accessorKey: "isActive",
    header: "Durum",
    cell: ({ row }) => {
      const isActive = row.getValue<boolean>("isActive")
      return React.createElement('span', {
        className: `px-2 py-1 rounded-full text-xs font-medium ${
          isActive 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`
      }, isActive ? 'Aktif' : 'Pasif')
    },
  },
]

