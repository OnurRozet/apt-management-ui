import { Card, CardContent } from '../ui/card'
import { Calendar, DollarSign, FileText, TrendingUp, TrendingDown, Users } from 'lucide-react'
import { IncomeSummaryDto } from '@/types'


const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const IncomeStatistic = ({ reports }: { reports: IncomeSummaryDto }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Toplam Gelir</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(reports.totalIncome)}
              </p>
              {/* Mock trend or additional info if needed */}
            </div>
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
               <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Bu Ay (Tahsilat)</p>
              <p className="text-2xl font-bold">
                {formatCurrency(reports.totalIncomeByCurrentMonth)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
               <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-sm font-medium text-muted-foreground">En Yüksek Kayn.</p>
                   {reports.highestApartmentFeeRevenue ? (
                         <div>
                            <p className="text-lg font-bold  max-w-[140px]" title={`${reports.highestApartmentFeeRevenue.apartmentLabel} - ${reports.highestApartmentFeeRevenue.ownerName}`}>
                                {reports.highestApartmentFeeRevenue.apartmentLabel} - {reports.highestApartmentFeeRevenue.ownerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(reports.highestApartmentFeeRevenue.totalAmount)}
                            </p>
                         </div>
                   ) : (
                       <p className="text-lg font-bold text-muted-foreground">-</p>
                   )}
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                   <DollarSign className="h-5 w-5" />
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">İşlem Sayısı</p>
              <p className="text-2xl font-bold">{reports.totalItemCount}</p>
            </div>
             <div className="p-3 rounded-full bg-purple-100 text-purple-600">
               <FileText className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ek Raporlar: En Düzenli Ödeyenler */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card className="overflow-hidden">
          <div className="p-1 px-6 pt-6 flex items-center gap-2 text-emerald-600">
             <TrendingUp className="h-5 w-5" />
             <h3 className="font-bold text-lg">En Düzenli Ödeyenler</h3>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-y">
                  <tr>
                    <th className="px-6 py-3">Daire</th>
                    <th className="px-6 py-3">Sakin</th>
                    <th className="px-6 py-3 text-center">İşlem Sayısı</th>
                    <th className="px-6 py-3 text-right">Toplam Ödeme</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reports.mostRegularPayer && reports.mostRegularPayer.length > 0 ? (
                    reports.mostRegularPayer.map((item, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-bold">{item.apartmentLabel}</td>
                        <td className="px-6 py-4">{item.ownerName}</td>
                        <td className="px-6 py-4 text-center">
                           <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                             {item.transactionCount} İşlem
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold">
                          {formatCurrency(item.totalAmount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground italic">
                        Henüz düzenli ödeme kaydı bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default IncomeStatistic

