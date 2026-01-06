'use client'

import { PaymentMatrixDto } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { CheckCircle2, XCircle } from 'lucide-react'

interface DuesYearlyTableProps {
  data: PaymentMatrixDto[]
}

const monthNames = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]

export default function DuesYearlyTable({ data }: DuesYearlyTableProps) {
  // Format para birimi
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  console.log("data", data);
  

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-10 bg-background min-w-37.5">
                Daire No
              </TableHead>
              <TableHead className="sticky left-37.5 z-10 bg-background min-w-30">
                Ev Sahibi
              </TableHead>
              {monthNames.map((month, index) => (
                <TableHead key={index} className="text-center min-w-37.5">
                  {month}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} className="text-center text-muted-foreground py-8">
                  Henüz daire kaydı bulunmamaktadır.
                </TableCell>
              </TableRow>
            ) : (
              data.map((tracking) => {
                // Backend'den gelen aylık değerleri sırayla al
                const monthlyAmounts = [
                  tracking.jan,
                  tracking.feb,
                  tracking.mar,
                  tracking.apr,
                  tracking.may,
                  tracking.jun,
                  tracking.jul,
                  tracking.aug,
                  tracking.sep,
                  tracking.oct,
                  tracking.nov,
                  tracking.dec,
                ]

                return (
                  <TableRow key={tracking.apartmentId}>
                    <TableCell className="sticky left-0 z-10 bg-background font-medium">
                      {tracking.apartmentLabel || `Daire ${tracking.apartmentId}`}
                    </TableCell>
                    <TableCell className="sticky left-37.5 z-10 bg-background">
                      {tracking.isManager ? tracking.ownerName + ` (Yönetici)` : tracking.ownerName}
                    </TableCell>
                    {monthlyAmounts.map((amount, index) => {
                      const isPaid = amount > 0
                      const isManager = tracking.isManager
                      return (
                        <TableCell key={index} className="text-center">
                          {isPaid ? (
                            <div className="flex flex-col items-center gap-1">
                              <Badge
                                variant="default"
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Ödendi
                              </Badge>
                              <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                                {formatCurrency(amount)}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              {isManager ? (
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                  Yönetici
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-muted-foreground"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Ödenmedi
                                </Badge>
                              )}

                              <span className="text-xs text-muted-foreground">
                                -
                              </span>
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

