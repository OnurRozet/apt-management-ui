import DuesTrackingClient from '@/components/dues/DuesTrackingClient'
import { DueService } from '@/services/due'
import { ManagementPeriodService } from '@/services/managementPeriod'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function GetYearlyPaymentDue(year:number) {
  try {
    const res = await DueService.getYearlyPaymentDue(year);

    if (res.status === 200 && res.data) {
      return res.data.resultObject;
    }
    return undefined;
  } catch (error) {
    console.error('Aidatlar yüklenemedi:', error);
    return undefined;
  }
}

async function GetManagementPeriod() {
  try {
    const res = await ManagementPeriodService.searchPeriods({pageSize:10, page:1});

    if (res.status === 200 && res.data) {
      return res.data.resultObject.searchResult;
    }
    return undefined;
  } catch (error) {
    console.error('Yönetim dönemi yüklenemedi:', error);
    return undefined;
  }
}



export default async function DuesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const year = Number(resolvedSearchParams?.year) || new Date().getFullYear()

  // Paralel olarak verileri çek
  const [paymentMatrix, managementPeriods] = await Promise.all([
    GetYearlyPaymentDue(year),
    GetManagementPeriod()
  ]);

  // Eğer gerekli veriler yoksa 404 sayfasına yönlendir
  if (!paymentMatrix || !managementPeriods) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <DuesTrackingClient
        paymentMatrix={paymentMatrix}
        initialYear={year}
        managementPeriods={managementPeriods}
      />
    </div>
  )
}

