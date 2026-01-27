import ManagementPeriodClient from "@/components/management-period/ManagementPeriodClient";
import { ManagementPeriodService } from "@/services/managementPeriod";
import { ApartmentService } from "@/services/apartment";
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

async function ApartmentList() {
  try {
    const res = await ApartmentService.searchApartments({
      page: 1,
      pageSize: 50,
    });

    if (res.status === 200 && res.data.isSuccess) {
      return res.data;
    }
    return undefined;
  } catch (error) {
    console.error('Daireler yüklenemedi:', error);
    return undefined;
  }
}

export default async function ManagementPeriodPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams

  const page = Number(resolvedSearchParams?.page) || 1
  const pageSize = Number(resolvedSearchParams?.pageSize) || 5

  const periodsRes = await ManagementPeriodService.searchPeriods({
    page: page,
    pageSize: pageSize,
  })

  // Hata Kontrolü
  if (periodsRes.status !== 200 || !periodsRes.data.isSuccess) {
    notFound()
  }

  const periodsResult = periodsRes.data.resultObject;
  
  // Daireleri paralel çekelim
  const apartments = await ApartmentList();

  // Daireler yüklenemezse
  if (!apartments || !apartments.isSuccess || !apartments.resultObject) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <ManagementPeriodClient 
        initialPeriods={periodsResult.searchResult} 
        initialApartments={apartments.resultObject.searchResult}
        initialTotalCount={periodsResult.totalItemCount}
      />
    </div>
  )
}
