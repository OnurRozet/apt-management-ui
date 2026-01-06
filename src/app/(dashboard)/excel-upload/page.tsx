'use client'

import { useRouter } from 'next/navigation'
import BankStatementUpload from '@/components/finance/BankStatementUpload'

export default function ExcelUploadPage() {
  const router = useRouter()

  const handleProcessSuccess = () => {
    // İşlem başarılı olduğunda sayfayı yenile veya yönlendir
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Banka Ekstresi Yükleme</h1>
        <p className="text-muted-foreground mt-1">
          Ziraat Bankası Excel dosyasını yükleyin, sistem otomatik analiz etsin ve onayınızla kaydedin.
        </p>
      </div>
      <BankStatementUpload onProcessSuccess={handleProcessSuccess} />
    </div>
  )
}

