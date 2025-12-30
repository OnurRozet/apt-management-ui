import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Calendar, DollarSign, FileText, TrendingDown } from 'lucide-react'
import { ExpenseSummaryDto } from '@/types'


const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(value)
}

const ExpenseStatistic = ({ reports }: { reports?: ExpenseSummaryDto }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Toplam Gider</p>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(reports?.totalExpense || 0)}</p>
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
              <p className="text-2xl font-bold">{formatCurrency(reports?.totalExpenseByCurrentMonth || 0)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Toplam Kayıt</p>
                <FileText className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{reports?.totalItemCount || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">En Yüksek Kategori</p>
                <DollarSign className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              {reports?.highestFeeCategory ? (
                <>
                  <p className="text-lg font-semibold text-muted-foreground">{reports.highestFeeCategory.expenseCategoryName}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(reports.highestFeeCategory.totalAmount)}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Veri yok</p>
              )}
            </CardContent>
          </Card>
        </div>
    </div>
  )
}

export default ExpenseStatistic
