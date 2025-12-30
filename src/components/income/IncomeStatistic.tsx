import { Card, CardContent, CardHeader } from '../ui/card'
import { Calendar, DollarSign, FileText, TrendingUp } from 'lucide-react'
import { IncomeSummaryDto } from '@/types'


const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(value)
}

const IncomeStatistic = ({ reports }: { reports: IncomeSummaryDto }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Toplam Gelir
              </p>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(reports.totalIncome)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Bu Ay</p>
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(reports.totalIncomeByCurrentMonth)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Toplam Kayıt
              </p>
              <FileText className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{reports.totalItemCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                En Fazla Aidat Geliri
              </p>
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            {reports.highestApartmentFeeRevenue ? (
              <>
                <p className="text-lg font-semibold truncate">
                  {reports.highestApartmentFeeRevenue.apartmentLabel} -{" "}
                  {reports.highestApartmentFeeRevenue.ownerName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(
                    reports.highestApartmentFeeRevenue.totalAmount
                  )}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Veri yok</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                En Düzenli Ödeme
              </p>
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            {reports.mostRegularPayer ? (
              <>
                {reports.mostRegularPayer.map((payer, index) => (
                  <div className="mb-2" key={index}>
                    <p className="text-lg font-semibold truncate">
                      {payer.apartmentLabel} - {payer.ownerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(payer.totalAmount)}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Veri yok</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default IncomeStatistic

