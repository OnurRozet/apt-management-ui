'use client'

import { Button } from '@/components/ui/button'
import { BarChart3, PlusCircle, FileSpreadsheet } from 'lucide-react'
import Link from 'next/link'

export default function ReportsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full">
        <BarChart3 className="h-16 w-16 text-slate-400" />
      </div>
      
      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight">Rapor Verisi Bulunamadı</h2>
        <p className="text-muted-foreground">
          Henüz sisteme gelir veya gider kaydı girilmediği için grafikler oluşturulamıyor. 
          Hemen veri girişi yaparak finansal durumunuzu takip etmeye başlayın.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default" className="gap-2">
          <Link href="/incomes">
            <PlusCircle className="h-4 w-4" />
            Gelir Ekle
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="gap-2 border-dashed">
          <Link href="/excel-upload">
            <FileSpreadsheet className="h-4 w-4" />
            Toplu Veri Yükle (Excel)
          </Link>
        </Button>
      </div>
    </div>
  )
}