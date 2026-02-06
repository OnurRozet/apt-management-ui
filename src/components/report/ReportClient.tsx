"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSummaryDto, ExpenseDistributionDto, MonthlyTrendDto } from "@/types";
import { Building2, Wallet, Activity, TrendingUp, PieChart } from "lucide-react";
import { LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ReportClientProps {
    summaryCards: DashboardSummaryDto;
    monthlyTrends: MonthlyTrendDto[];
    expenseDistribution: ExpenseDistributionDto[];
}

// Para formatı fonksiyonu
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

// Renk paleti
const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
];

const ReportClient = ({ summaryCards, monthlyTrends, expenseDistribution }: ReportClientProps) => {
  // Pasta grafiği için veri hazırlama
  const pieData = expenseDistribution.map((item) => ({
    name: item.categoryName,
    value: item.totalAmount,
    percentage: item.percentage,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Yönetim Paneli
        </h1>
      </div>

      {/* KPI Kartları Alanı - Responsive Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Kart 1: Toplam Kasa Bakiyesi */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Gelir
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div
                className={`mb-2 text-2xl font-bold ${
                  summaryCards.totalIncome >= 0
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {formatCurrency(summaryCards.totalIncome)}
              </div>
            <p className="text-xs text-muted-foreground mt-1">Elde edilen toplam gelir</p>
          </CardContent>
        </Card>
        {/* Kart 2: Beklenen Gelir */}

            <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Gider
            </CardTitle>
            <Wallet className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summaryCards.totalExpense)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Yapılan toplam gider
            </p>
          </CardContent>
        </Card>
        

        {/* Kart 3: Ödemesi Beklenen Giderler */}
    
<Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Yıllık Beklenen Aidat Geliri
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summaryCards.expectedIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Yıl bazında beklenen gelirler
            </p>
          </CardContent>
        </Card>
        {/* Kart 4: Borçlu Daire Sayısı */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Borçlu Daire Sayısı
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryCards.activeDebtorsCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Aktif borçlu daire
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grafikler ve Tablolar */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Aylık Trend Grafiği */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Aylık Gelir-Gider Trendi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="monthName"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                  tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  //formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalIncome"
                  name="Gelir"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalExpense"
                  name="Gider"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gider Dağılımı Pasta Grafiği */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Gider Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  //label={({ name, percentage }) => `${name}: %${percentage.toFixed(1)}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  //formatter={(value: number) => formatCurrency(value)}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gider Dağılımı Detay Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle>Gider Dağılımı Detayları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Kategori
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Toplam Tutar
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Yüzde
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Görsel
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expenseDistribution.map((item, index) => {
                    const total = expenseDistribution.reduce(
                      (sum, exp) => sum + exp.totalAmount,
                      0
                    );
                    const widthPercentage = (item.totalAmount / total) * 100;

                    return (
                      <tr
                        key={index}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4 align-middle font-medium">
                          {item.categoryName}
                        </td>
                        <td className="p-4 align-middle">
                          {formatCurrency(item.totalAmount)}
                        </td>
                        <td className="p-4 align-middle">
                          %{item.percentage.toFixed(2)}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="h-2.5 rounded-full transition-all"
                              style={{
                                width: `${widthPercentage}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-bold bg-muted/50">
                    <td className="p-4 align-middle">TOPLAM</td>
                    <td className="p-4 align-middle">
                      {formatCurrency(
                        expenseDistribution.reduce(
                          (sum, item) => sum + item.totalAmount,
                          0
                        )
                      )}
                    </td>
                    <td className="p-4 align-middle">%100</td>
                    <td className="p-4 align-middle"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportClient
