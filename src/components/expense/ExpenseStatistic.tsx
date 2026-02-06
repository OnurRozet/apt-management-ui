import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Calendar, DollarSign, FileText, TrendingDown, } from 'lucide-react'
import { ExpenseSummaryDto } from '@/types'
import { formatCurrency } from '@/lib/formatCurrency'


const ExpenseStatistic = ({ reports }: { reports?: ExpenseSummaryDto }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Toplam Gider</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(reports?.totalExpense || 0)}</p>
              </div>
               <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <TrendingDown className="h-5 w-5" />
               </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Bu Ay (Gider)</p>
                <p className="text-2xl font-bold">{formatCurrency(reports?.totalExpenseByCurrentMonth || 0)}</p>
              </div>
               <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Calendar className="h-5 w-5" />
               </div>
            </CardContent>
          </Card>

          <Card>
             <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-sm font-medium text-muted-foreground">En Çok Gider</p>
                   {reports?.highestFeeCategory ? (
                      <div title={reports.highestFeeCategory.expenseCategoryName}>
                          <p className="text-lg font-bold truncate max-w-[120px]">
                              {reports.highestFeeCategory.expenseCategoryName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                              {formatCurrency(reports.highestFeeCategory.totalAmount)}
                          </p>
                      </div>
                   ) : (
                      <p className="text-lg font-bold text-muted-foreground">-</p>
                   )}
                </div>
                <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                   <DollarSign className="h-5 w-5" />
                </div>
             </CardContent>
          </Card>

          <Card>
             <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-sm font-medium text-muted-foreground">Fatura Sayısı</p>
                   <p className="text-2xl font-bold">{reports?.totalItemCount || 0}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                   <FileText className="h-5 w-5" />
                </div>
             </CardContent>
          </Card>
        </div>
    </div>
  )
}

export default ExpenseStatistic
