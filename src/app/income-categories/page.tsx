import IncomeCategoryClient from '@/components/income-category/IncomeCategoryClient'
import { IncomeCategoryService } from '@/services/income'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function IncomeCategoriesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams

  const page = Number(resolvedSearchParams?.page) || 1
  const pageSize = Number(resolvedSearchParams?.pageSize) || 10

  const categoriesRes = await IncomeCategoryService.searchIncomesCategory({
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
      <IncomeCategoryClient 
        initialCategories={categoryResult.searchResult} 
        initialTotalCount={categoryResult.totalItemCount}
      />
    </div>
  )
}

