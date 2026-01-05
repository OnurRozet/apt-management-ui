import ExpenseCategoryClient from '@/components/expense-category/ExpenseCategoryClient'
import { ExpenseCategoryService } from '@/services/expense'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ExpenseCategoriesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams

  const page = Number(resolvedSearchParams?.page) || 1
  const pageSize = Number(resolvedSearchParams?.pageSize) || 10

  const categoriesRes = await ExpenseCategoryService.searchExpensesCategory({
    page: page,
    pageSize: pageSize,
    name: typeof resolvedSearchParams.name === 'string' ? resolvedSearchParams.name : undefined,
  })

  // Hata Kontrolü
  if (categoriesRes.status !== 200 || !categoriesRes.data.isSuccess) {
    notFound()
  }

  const categoryResult = categoriesRes.data.resultObject;

  return (
    <div className="space-y-6">
      <ExpenseCategoryClient 
        initialCategories={categoryResult.searchResult} 
        initialTotalCount={categoryResult.totalItemCount}
      />
    </div>
  )
}

