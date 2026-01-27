import ApartmentListClient from "@/components/flat/ApartmentListClient";
import { ApartmentService } from "@/services/apartment";
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic'


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


export default async function ApartmentsPage() {
  const apartments = await ApartmentList();  

  if (!apartments || !apartments.isSuccess ) {
    notFound()
  }

  if(apartments.resultObject.searchResult.length === 0) {
    redirect('/flats/import');
  }

  return (
    <div className="space-y-6">
      <ApartmentListClient apartments={apartments.resultObject.searchResult} />
    </div>
  );
}