"use client";

import { ManagementPeriodDto, PaymentMatrixDto } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";

interface DuesYearlyTableProps {
  data: PaymentMatrixDto[];
  managementPeriod?: ManagementPeriodDto[];
}

const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

export default function DuesYearlyTable({
  data,
  managementPeriod,
}: DuesYearlyTableProps) {
  const isDateInManagementRange = (
    monthIndex: number,
    year: number,
    apartmentId: number,
  ) => {
    if (!managementPeriod || managementPeriod.length === 0) return false;
    const cellDate = new Date(year, monthIndex, 15);
    return managementPeriod.some((period) => {
      if (period.apartmentId !== apartmentId) return false;
      const start = new Date(period.startDate);
      const end = period.endDate ? new Date(period.endDate) : null;
      return end ? cellDate >= start && cellDate <= end : cellDate >= start;
    });
  };

  const colWidths = {
    apartment: "100px",
    owner: "150px",
    summary: "120px",
  };

  // Sticky Left positions
  const leftPos = {
    apartment: "0px",
    owner: "100px",
  };

  return (
    <div className="overflow-x-auto">
      <Table className="border-separate border-spacing-0 w-full text-sm">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead
              style={{ left: leftPos.apartment, minWidth: colWidths.apartment }}
              className="sticky left-0 z-30 bg-muted/95 backdrop-blur border-b border-border h-12 font-bold text-foreground shadow-[1px_0_0_0_hsl(var(--border))]"
            >
              Daire No
            </TableHead>
            <TableHead
              style={{ left: leftPos.owner, minWidth: colWidths.owner }}
              className="sticky z-30 bg-muted/95 backdrop-blur border-b border-border h-12 font-bold text-foreground shadow-[1px_0_0_0_hsl(var(--border))]"
            >
              Ev Sahibi
            </TableHead>

            <TableHead
              style={{ minWidth: colWidths.summary }}
              className="text-center bg-amber-500/10 backdrop-blur border-b border-border h-12 font-bold text-amber-700 dark:text-amber-500"
            >
              Geçmişten Devir
            </TableHead>

            <TableHead
              style={{ minWidth: colWidths.summary }}
              className="text-center bg-blue-500/10 backdrop-blur border-b border-border h-12 font-bold text-blue-700 dark:text-blue-400"
            >
              Toplam Borç
            </TableHead>

            <TableHead
              style={{ minWidth: colWidths.summary }}
              className="text-center bg-emerald-500/10 backdrop-blur border-b border-border h-12 font-bold text-emerald-700 dark:text-emerald-400"
            >
              Toplam Ödenen
            </TableHead>

            <TableHead
              style={{ minWidth: colWidths.summary }}
              className="text-center bg-red-500/10 backdrop-blur border-b border-border h-12 font-bold text-red-700 dark:text-red-400"
            >
              Kalan Borç
            </TableHead>

            {monthNames.map((month, index) => (
              <TableHead
                key={index}
                className="text-center min-w-[100px] bg-muted/50 border-b border-border font-medium"
              >
                {month}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={18}
                className="text-center text-muted-foreground py-8"
              >
                Henüz daire kaydı bulunmamaktadır.
              </TableCell>
            </TableRow>
          ) : (
            data.map((tracking) => {
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
              ];

              const transferDebt = tracking.transferredDebt || 0;
              const totalPaid = tracking.totalPaid || 0;
              const remainingDebt =
                tracking.currentBalance ;

              // Mock management year if needed, usually passed as prop or context
              const year = new Date().getFullYear();

              return (
                <TableRow
                  key={tracking.apartmentId}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  {/* Daire No */}
                  <TableCell
                    style={{ left: leftPos.apartment }}
                    className="sticky left-0 z-20 bg-background font-medium border-r border-border group-hover:bg-muted/30 whitespace-nowrap"
                  >
                    {tracking.apartmentLabel}
                  </TableCell>

                  {/* Ev Sahibi */}
                  <TableCell
                    style={{ left: leftPos.owner }}
                    className="sticky z-20 bg-background border-r border-border group-hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[120px] text-xs font-medium">
                        {tracking.ownerName}
                      </span>
                      {tracking.isManager && (
                        <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
                      )}
                    </div>
                  </TableCell>

                  {/* Geçmişten Devir */}
                  <TableCell className="text-center bg-amber-500/5 group-hover:bg-amber-500/10 border-r border-border transition-colors">
                    {transferDebt > 0 ? (
                      <div className="flex flex-col items-center gap-0.5 py-1">
                        <Badge
                          variant="outline"
                          className="border-amber-500/50 text-amber-600 dark:text-amber-400 bg-amber-500/10 py-0 h-5 px-2 text-[10px] font-normal"
                        >
                          Devir
                        </Badge>
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-500 tabular-nums">
                          {formatCurrency(transferDebt)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">
                        -
                      </span>
                    )}
                  </TableCell>

                  {/* Toplam Borç */}
                  <TableCell className="text-center bg-blue-500/5 group-hover:bg-blue-500/10 border-r border-border transition-colors">
                    <div className="flex flex-col items-center py-1">
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                        {formatCurrency(tracking.totalDebtUntilNow)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        (Yıllık: {formatCurrency(tracking.totalYearlyDebt)})
                      </span>
                    </div>
                  </TableCell>

                  {/* Toplam Ödenen */}
                  <TableCell className="text-center bg-emerald-500/5 group-hover:bg-emerald-500/10 border-r border-border transition-colors">
                    {totalPaid > 0 ? (
                      <div className="flex flex-col items-center gap-0.5 py-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                          {formatCurrency(totalPaid)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">
                        -
                      </span>
                    )}
                  </TableCell>

                  {/* Kalan Borç */}
                  <TableCell className="text-center bg-red-500/5 group-hover:bg-red-500/10 border-r border-border transition-colors">
                    {remainingDebt > 0 ? (
                      <div className="flex flex-col items-center gap-0.5 py-1">
                        <Badge
                          variant="outline"
                          className="border-red-500/50 text-red-600 dark:text-red-400 bg-red-500/10 py-0 h-5 px-2 text-[10px] font-normal"
                        >
                          Borç
                        </Badge>
                        <span className="text-xs font-bold text-red-700 dark:text-red-400 tabular-nums">
                          {formatCurrency(remainingDebt)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-0.5 py-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                          Borç Yok
                        </span>
                      </div>
                    )}
                  </TableCell>

                  {/* Aylık Ödemeler */}
                  {monthlyAmounts.map((amount, index) => {
                    const isPaid = amount > 0;
                    const isExempt = isDateInManagementRange(
                      index,
                      year,
                      tracking.apartmentId,
                    );

                    return (
                      <TableCell
                        key={index}
                        className={`text-center p-2 border-r border-border last:border-r-0 ${isExempt && !isPaid ? "bg-blue-500/5" : ""}`}
                      >
                        <div className="flex flex-col items-center justify-center min-h-[40px]">
                          {isPaid ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <div className="flex items-center text-emerald-600 dark:text-emerald-500">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 tabular-nums leading-none">
                                {formatCurrency(amount)}
                              </span>
                            </div>
                          ) : isExempt ? (
                            <div className="flex flex-col items-center">
                              <Badge
                                variant="secondary"
                                className="bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border-0 h-5 px-1.5 text-[10px]"
                              >
                                Muaf
                              </Badge>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <XCircle className="h-4 w-4 text-muted-foreground/20" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
