"use client"

import React from "react"
import { ManagementPeriodDto } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

export const managementPeriodColumns: ColumnDef<ManagementPeriodDto>[] = [
  {
    accessorKey: "apartmentId",
    header: "Daire",
    cell: ({ row }) => {
      // Bu bilgiyi apartment listesinden alacağız, şimdilik ID gösteriyoruz
      const apartmentId = row.getValue<number>("apartmentId")
      return `Daire ${apartmentId}`
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
    accessorKey: "isExemptFromDues",
    header: "Aidattan Muaf",
    cell: ({ row }) => {
      const isExempt = row.getValue<boolean>("isExemptFromDues")
      return React.createElement('span', {
        className: `px-2 py-1 rounded-full text-xs font-medium ${
          isExempt 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`
      }, isExempt ? 'Evet' : 'Hayır')
    },
  },
  {
    accessorKey: "isActive",
    header: "Durum",
    cell: ({ row }) => {
      const isActive = row.original.isActive !== false
      return React.createElement('span', {
        className: `px-2 py-1 rounded-full text-xs font-medium ${
          isActive 
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
            : 'bg-destructive/15 text-destructive dark:bg-destructive/25 dark:text-destructive'
        }`
      }, isActive ? 'Aktif' : 'Pasif')
    },
  },
]

