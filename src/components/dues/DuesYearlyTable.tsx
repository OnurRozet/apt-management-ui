/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ManagementPeriodDto, PaymentMatrixDto } from '@/types'
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
import { CheckCircle2, XCircle, ShieldCheck, History } from 'lucide-react'

interface DuesYearlyTableProps {
  data: PaymentMatrixDto[]
  managementPeriod?: ManagementPeriodDto[]
}

const monthNames = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
]

export default function DuesYearlyTable({ data, managementPeriod }: DuesYearlyTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const isDateInManagementRange = (monthIndex: number, year: number, apartmentId: number) => {
    if (!managementPeriod || managementPeriod.length === 0) return false;
    const cellDate = new Date(year, monthIndex, 15);
    return managementPeriod.some(period => {
      if (period.apartmentId !== apartmentId) return false;
      const start = new Date(period.startDate);
      const end = period.endDate ? new Date(period.endDate) : null;
      return end ? (cellDate >= start && cellDate <= end) : (cellDate >= start);
    });
  };

  const colWidths = {
    apartment: '100px',
    owner: '150px',
    transfer: '130px'
  }

  // Sticky Left hesapları (Kümülatif)
  const leftPos = {
    apartment: '0px',
    owner: '100px', // colWidths.apartment
    transfer: '250px' // colWidths.apartment + colWidths.owner
  }

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <Table className="border-separate border-spacing-0">
          <TableHeader>
            <TableRow>
              <TableHead
                style={{ left: leftPos.apartment, minWidth: colWidths.apartment }}
                className="sticky left-0 z-30 bg-background border-b shadow-[1px_0_0_0_#e2e8f0]">
                Daire No
              </TableHead>
              <TableHead
                style={{ left: leftPos.owner, minWidth: colWidths.owner }}
                className="sticky z-30 bg-background border-b shadow-[1px_0_0_0_#e2e8f0]">
                Ev Sahibi
              </TableHead>
              
              <TableHead
                style={{ left: leftPos.transfer, minWidth: colWidths.transfer }}
                className="sticky z-30 text-center bg-amber-50/90 dark:bg-amber-950/30 font-bold text-amber-700 dark:text-amber-500 border-b shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]">
                Geçmişten Devir
              </TableHead>

              {monthNames.map((month, index) => (
                <TableHead key={index} className="text-center min-w-[130px] border-b">
                  {month}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} className="text-center text-muted-foreground py-8">
                  Henüz daire kaydı bulunmamaktadır.
                </TableCell>
              </TableRow>
            ) : (
              data.map((tracking) => {
                const monthlyAmounts = [
                  tracking.jan, tracking.feb, tracking.mar, tracking.apr,
                  tracking.may, tracking.jun, tracking.jul, tracking.aug,
                  tracking.sep, tracking.oct, tracking.nov, tracking.dec,
                ]

                const transferDebt = (tracking as any).transferredDebt || 0;

                return (
                  <TableRow key={tracking.apartmentId} className="hover:bg-muted/50 transition-colors group">
                    <TableCell 
                      style={{ left: leftPos.apartment }}
                      className="sticky left-0 z-10 bg-background font-medium border-r group-hover:bg-muted/50">
                      {tracking.apartmentLabel}
                    </TableCell>
                    <TableCell
                      style={{ left: leftPos.owner }}
                      className="sticky z-10 bg-background border-r group-hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[120px]">{tracking.ownerName}</span>
                        {tracking.isManager && <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />}
                      </div>
                    </TableCell>

                    <TableCell
                      style={{ left: leftPos.transfer }}
                      className="sticky z-10 text-center bg-amber-50/30 dark:bg-amber-950/10 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] group-hover:bg-amber-100/40 dark:group-hover:bg-amber-900/20">
                      {transferDebt > 0 ? (
                        <div className="flex flex-col items-center gap-1">
                          <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-100/50 py-0 text-[10px]">
                            <History className="h-3 w-3 mr-1" /> Devir
                          </Badge>
                          <span className="text-xs font-bold text-amber-800 dark:text-amber-500">
                            {formatCurrency(transferDebt)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-[10px] italic font-medium">Borçsuz</span>
                      )}
                    </TableCell>

                    {monthlyAmounts.map((amount, index) => {
                      const isPaid = amount > 0;
                      const isExempt = isDateInManagementRange(index, 2025, tracking.apartmentId);

                      return (
                        <TableCell 
                          key={index} 
                          className={`text-center border-r last:border-r-0 ${isExempt && !isPaid ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {isPaid ? (
                              <>
                                <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 h-6">
                                  <CheckCircle2 className="h-3 w-3 mr-1" /> Ödendi
                                </Badge>
                                <span className="text-[11px] font-bold text-green-700 dark:text-green-400">
                                  {formatCurrency(amount)}
                                </span>
                              </>
                            ) : isExempt ? (
                              <>
                                <Badge variant="secondary" className="bg-blue-600 text-white border-0 h-6">
                                  Yönetici
                                </Badge>
                                <span className="text-[10px] text-blue-600 font-bold uppercase italic">Muaf</span>
                              </>
                            ) : (
                              <>
                                <Badge variant="outline" className="text-muted-foreground/60 h-6">
                                  <XCircle className="h-3 w-3 mr-1" /> Ödenmedi
                                </Badge>
                                <span className="text-[11px] text-muted-foreground">-</span>
                              </>
                            )}
                          </div>
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