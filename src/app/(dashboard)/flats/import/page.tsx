'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react'
import { toast } from 'sonner' // veya kullandığın toast kütüphanesi
import { ApartmentService } from '@/services/apartment'
import { useRouter } from 'next/navigation'

export default function ExcelUploadCard() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return toast.error("Lütfen bir dosya seçin")

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file) // Backend'deki parametre ismiyle aynı olmalı (file)
    try {
      const response = await ApartmentService.uploadExcel(file)

      if (response.status === 200 && response.data.isSuccess) {
        toast.success("Daireler ve borçlar başarıyla yüklendi!")
        setFile(null)
        router.refresh();
        // onUploadSuccess() // Tabloyu yenilemek için
      } else {
        toast.error("Yükleme sırasında bir hata oluştu")
      }
    } catch (error) {
      toast.error("Sunucuya bağlanılamadı" + ` ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-8 border-dashed border-2">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />
          Toplu Daire ve Borç Aktarımı
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 w-full">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
          />
          <Button 
            onClick={handleUpload} 
            disabled={!file || loading}
            className="min-w-30"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Yükle
          </Button>
        </div>
        <p className="text-xs text-muted-foreground italic">
          * Önce örnek şablonu indirin. A sütunu Daire No, D sütunu Geçmiş Borç olmalıdır.
        </p>
      </CardContent>
    </Card>
  )
}