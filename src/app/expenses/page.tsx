import ExpensesClient from '@/components/expense/ExpensesClient'
import { ExpenseCategoryService, ExpenseService } from '@/services/expense'

// Build sırasında pre-render edilmesini engelle (API çağrıları runtime'da yapılacak)
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function ExpenseCategory() {
   try {
     const res = await ExpenseCategoryService.searchExpensesCategory({
       page: 1,
       pageSize: 100,
     })

     if (res.status === 200 && res.data.isSuccess) {
       return res.data
     }
     return undefined
   } catch (error) {
     console.error('Gider kategorileri yüklenemedi:', error)
     return undefined
   }
}

async function ExpenseSummaryReport() {
   try {
     const res = await ExpenseService.getSummaryExpenseReport()

     if (res.status === 200 && res.data.isSuccess) {
       return res.data.resultObject
     }
     return undefined
   } catch (error) {
     console.error('Gider raporları yüklenemedi:', error)
     return undefined
   }
}

export default async function ExpensesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

const page = Number(resolvedSearchParams?.page) || 1;
  const pageSize = Number(resolvedSearchParams?.pageSize) || 5;

  const expensesRes = await ExpenseService.searchExpenses({
    page: page,
    pageSize: pageSize,
    expenseCategoryId:
      typeof resolvedSearchParams.expenseCategoryId === "string"
        ? parseInt(resolvedSearchParams.expenseCategoryId)
        : undefined,
    keyword:
      typeof resolvedSearchParams.keyword === "string"
        ? resolvedSearchParams.keyword
        : undefined,
  });

  // Hata Kontrolü (Basitleştirilmiş)
  if (expensesRes.status !== 200 || !expensesRes.data.isSuccess) {
    return <div>Veriler yüklenemedi...</div>;
  }
  const expenseCategories = await ExpenseCategory();

  const expenseSummaryReport = await ExpenseSummaryReport();

  if (
    !expenseCategories ||
    !expenseCategories.resultObject ||
    expenseCategories.isSuccess !== true
  ) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Gider kategorileri yüklenemedi.</p>
      </div>
    );
  }  

  return (
    <div className="space-y-6">
      <ExpensesClient
        initialExpenses={expensesRes.data.resultObject.searchResult}
        initialExpenseCategories={expenseCategories.resultObject.searchResult}
        initialTotalCount={expensesRes.data.resultObject.totalItemCount}
        reports={expenseSummaryReport}
      />
    </div>
  );
}

