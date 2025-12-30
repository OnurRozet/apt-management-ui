import IncomesClient from '@/components/income/IncomesClient'
import { IncomeCategoryService, IncomeService } from '@/services/income'
import { ApartmentService } from '@/services/apartment'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function GetSummaryIncomeReport() {
  try {
    const res = await IncomeService.getSummaryIncomeReport()

    if (res.status === 200 && res.data.isSuccess) {
      return res.data.resultObject
    }
    return undefined
  } catch (error) {
    console.error('Özet gelir raporları yüklenemedi:', error)
    return undefined
  }
}

async function IncomeCategory() {
  try {
    const res = await IncomeCategoryService.searchIncomesCategory({
      page: 1,
      pageSize: 100,
    })

    if (res.status === 200 && res.data.isSuccess) {
      return res.data
    }
    return undefined
  } catch (error) {
    console.error('Gelir kategorileri yüklenemedi:', error)
    return undefined
  }
}

async function ApartmentList() {
  try {
    const res = await ApartmentService.searchApartments({
      page: 1,
      pageSize: 100,
    })

    if (res.status === 200 && res.data.isSuccess) {
      return res.data
    }
    return undefined
  } catch (error) {
    console.error('Daireler yüklenemedi:', error)
    return undefined
  }
}
export default async function IncomesPage({ searchParams }: PageProps) {
   
  const resolvedSearchParams = await searchParams

  const page = Number(resolvedSearchParams?.page) || 1
  const pageSize = Number(resolvedSearchParams?.pageSize) || 5

  const incomesRes = await IncomeService.searchIncomes({
    page: page,
    pageSize: pageSize,
    apartmentNo: typeof resolvedSearchParams.apartmentNo === 'string' ? resolvedSearchParams.apartmentNo : undefined,
    incomeCategoryId: typeof resolvedSearchParams.incomeCategoryId === 'string' ? parseInt(resolvedSearchParams.incomeCategoryId) : undefined,
    apartmentId: typeof resolvedSearchParams.apartmentId === 'string' ? parseInt(resolvedSearchParams.apartmentId) : undefined,
  })

  // Hata Kontrolü (Basitleştirilmiş)
  if (incomesRes.status !== 200 || !incomesRes.data.isSuccess) {
    return <div>Veriler yüklenemedi...</div>
  }

  const incomeResult = incomesRes.data.resultObject;
  // Yardımcı verileri paralel çekelim (Performans artışı)
  const [incomeCategories, apartments, reports] = await Promise.all([
    IncomeCategory(),
    ApartmentList(),
    GetSummaryIncomeReport()
  ]);

// Kategori yüklenemezse
  if (!incomeCategories || !incomeCategories.resultObject || !incomeCategories.isSuccess) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Gelir kategorileri yüklenemedi.</p>
      </div>
    )
  }

  // Daireler yüklenemezse (Typo düzeltildi: !apartments || !apartments -> !apartments)
  if (!apartments) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Daire listesi yüklenemedi.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <IncomesClient 
        initialIncomes={incomeResult.searchResult} 
        initialIncomeCategories={incomeCategories.resultObject.searchResult}
        initialApartments={apartments?.resultObject?.searchResult || []}
        initialTotalCount={incomeResult.totalItemCount}
        reports={reports || { totalIncome: 0, totalItemCount: 0, totalIncomeByCurrentMonth: 0 , highestApartmentFeeRevenue: null,mostRegularPayer: null}}
      />
    </div>
  )
}

