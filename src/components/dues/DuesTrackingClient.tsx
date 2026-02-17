"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ManagementPeriodDto, PaymentMatrixDto } from "@/types";
import DuesYearlyTable from "./DuesYearlyTable";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  Wallet,
  AlertCircle,
  Download,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { IncomeService } from "@/services/income";
import { toast } from "sonner";

interface DuesTrackingClientProps {
  paymentMatrix: PaymentMatrixDto[];
  initialYear?: number;
  managementPeriods: ManagementPeriodDto[];
}

export default function DuesTrackingClient({
  paymentMatrix,
  initialYear,
  managementPeriods,
}: DuesTrackingClientProps) {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const currentYearFromUrl = initialYear || new Date().getFullYear();

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const response =
        await IncomeService.exportPaymentMatrix(currentYearFromUrl);

      // Blob'dan dosyayı indir
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Aidat_Takibi_${currentYearFromUrl}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Excel dosyası başarıyla indirildi");
    } catch (error) {
      console.error("Excel indirme hatası:", error);
      toast.error("Excel dosyası indirilemedi");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreviousYear = () => {
    const newYear = currentYearFromUrl - 1;
    router.push(`/dues?year=${newYear}`);
  };

  const handleNextYear = () => {
    const newYear = currentYearFromUrl + 1;
    router.push(`/dues?year=${newYear}`);
  };

  const handleYearChange = (value: string) => {
    const newYear = Number(value);
    router.push(`/dues?year=${newYear}`);
  };

  // Yıl seçenekleri (mevcut yıl ± 5 yıl)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Basit İstatistikler (Client-side hesaplama)
  const totalDues = paymentMatrix.reduce(
    (acc, curr) => acc + curr.totalYearlyDebt,
    0,
  );
  const totalPaid = paymentMatrix.reduce(
    (acc, curr) => acc + curr.totalPaid,
    0,
  );

  const transfferedDebt = paymentMatrix.reduce(
    (acc, curr) => acc + curr.transferredDebt,
    0,
  );
  const collectionRate = totalDues > 0 ? (totalPaid / totalDues) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aidat Takibi</h1>
          <p className="text-muted-foreground mt-1">
            {currentYearFromUrl} yılı için daire bazlı aidat ödeme ve borç
            durumu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            disabled={isExporting || paymentMatrix.length === 0}
            className="gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Excel İndir
          </Button>

          <div className="flex items-center gap-2 bg-card p-1 rounded-lg border shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousYear}
              disabled={currentYearFromUrl <= currentYear - 5}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Select
              value={currentYearFromUrl.toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-[120px] border-none shadow-none focus:ring-0">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextYear}
              disabled={currentYearFromUrl >= currentYear + 5}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Yıllık Tahsilat Oranı
              </p>
              <p className="text-2xl font-bold">{collectionRate.toFixed(1)}%</p>
            </div>
            <div
              className={`p-3 rounded-full ${collectionRate >= 80 ? "bg-emerald-100 text-emerald-600" : "bg-yellow-100 text-yellow-600"}`}
            >
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Toplanan Aidat
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {new Intl.NumberFormat("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                  maximumFractionDigits: 0,
                }).format(totalPaid)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
              <Wallet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Bekleyen Ödeme
              </p>
              <p className="text-2xl font-bold text-destructive">
                {new Intl.NumberFormat("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                  maximumFractionDigits: 0,
                }).format(transfferedDebt + totalDues - totalPaid)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 text-destructive">
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yıllık Tablo */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <DuesYearlyTable
          data={paymentMatrix}
          managementPeriod={managementPeriods}
          year={currentYearFromUrl}
        />
      </div>
    </div>
  );
}
