import DuesSettingsClient from '@/components/dues-setting/DuesSettingsClient'
import { DuesSettingService } from '@/services/due'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DuesSettingsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams

  const page = Number(resolvedSearchParams?.page) || 1
  const pageSize = Number(resolvedSearchParams?.pageSize) || 10

  const duesSettingsRes = await DuesSettingService.searchDuesSettings({
    page: page,
    pageSize: pageSize,
  })

  // Hata Kontrolü
  if (duesSettingsRes.status !== 200 || !duesSettingsRes.data.isSuccess) {
    notFound()
  }

  const duesSettingsResult = duesSettingsRes.data.resultObject;

  return (
    <div className="space-y-6">
      <DuesSettingsClient 
        initialDuesSettings={duesSettingsResult.searchResult} 
        initialTotalCount={duesSettingsResult.totalItemCount}
      />
    </div>
  )
}

