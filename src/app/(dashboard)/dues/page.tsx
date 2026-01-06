import DuesTrackingClient from '@/components/dues/DuesTrackingClient'
import { DueService } from '@/services/due'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

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



export default async function DuesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const year = Number(resolvedSearchParams?.year) || new Date().getFullYear()

  // Paralel olarak verileri çek
  const res = await GetYearlyPaymentDue(year);

  if (!res) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <DuesTrackingClient
        paymentMatrix={res}
        initialYear={year}
      />
    </div>
  )
}

