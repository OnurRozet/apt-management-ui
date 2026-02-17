import DuesTrackingClient from '@/components/dues/DuesTrackingClient'
import { ApartmentService } from '@/services/apartment'
import { DueService } from '@/services/due'
import { ManagementPeriodService } from '@/services/managementPeriod'
import { notFound } from 'next/navigation'
import type { ManagementPeriodDto, PaymentMatrixDto } from '@/types'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function GetYearlyPaymentDue(year: number) {
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
    const res = await ManagementPeriodService.searchPeriods({ pageSize: 100, page: 1 });

    if (res.status === 200 && res.data?.isSuccess && res.data.resultObject) {
      return res.data.resultObject.searchResult;
    }
    return undefined;
  } catch (error) {
    console.error('Yönetim dönemi yüklenemedi:', error);
    return undefined;
  }
}

async function GetApartments() {
  try {
    const res = await ApartmentService.searchApartments({ pageSize: 200, page: 1 });

    if (res.status === 200 && res.data?.isSuccess && res.data.resultObject) {
      console.log(res.data.resultObject.searchResult)

      return res.data.resultObject.searchResult;
    }
    return undefined;
  } catch (error) {
    console.error('Daireler yüklenemedi:', error);
    return undefined;
  }
}

function createManagerPlaceholderRow(
  apartmentId: number,
  apartmentLabel: string,
  ownerName: string
): PaymentMatrixDto {
  return {
    apartmentId,
    apartmentLabel,
    ownerName,
    isManager: true,
    totalPaid: 0,
    totalYearlyDebt: 0,
    totalDebtUntilNow: 0,
    transferredDebt: 0,
    currentBalance: 0,
    amount: 0,
    jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
    jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
  };
}

export default async function DuesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const year = Number(resolvedSearchParams?.year) || new Date().getFullYear();

  // Paralel olarak verileri çek
  const [paymentMatrix, managementPeriods, apartments] = await Promise.all([
    GetYearlyPaymentDue(year),
    GetManagementPeriod(),
    GetApartments()
  ]);

  if (!paymentMatrix || !managementPeriods) {
    notFound();
  }

  const apartmentMap = new Map(apartments?.map((a) => [a.id, a]) ?? []);

  // Yönetim dönemi olan (yönetici) daire ID'leri
  const managerApartmentIds = new Set(
    managementPeriods.map((p: ManagementPeriodDto) => p.apartmentId)
  );

  // Payment matrix'te olmayan yönetici daireler
  const existingIds = new Set(paymentMatrix.map((p) => p.apartmentId));
  const missingManagers = [...managerApartmentIds].filter((id) => !existingIds.has(id));

  const managerRows: PaymentMatrixDto[] = missingManagers
    .map((apartmentId) => {
      const apt = apartmentMap.get(apartmentId);
      return createManagerPlaceholderRow(
        apartmentId,
        apt?.label ?? `Daire ${apartmentId}`,
        apt?.ownerName ?? '-'
      );
    });

  const mergedMatrix: PaymentMatrixDto[] = [...paymentMatrix, ...managerRows].sort(
    (a, b) => (a.apartmentLabel ?? '').localeCompare(b.apartmentLabel ?? '', undefined, { numeric: true })
  );


  return (
    <div className="space-y-6">
      <DuesTrackingClient
        paymentMatrix={mergedMatrix}
        initialYear={year}
        managementPeriods={managementPeriods}
      />
    </div>
  );
}

