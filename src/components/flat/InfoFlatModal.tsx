'use client'

import React from 'react'
import { Home, User, Wallet } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Apartment } from '@/types'
import { formatCurrency } from '@/lib/formatCurrency'

interface InfoFlatModalProps {
  data?: Apartment
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function InfoFlatModal({ data, open, onOpenChange }: InfoFlatModalProps) {
  const hasTenant = Boolean(data?.tenantName)
  const balanceClass = data?.balance && data.balance < 0 ? 'text-destructive' : 'text-emerald-600'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Home className="h-5 w-5" />
                </div>
                {data ? `${data.label}` : 'Daire bilgisi bulunamadı'}
              </DialogTitle>
              <DialogDescription className="text-base ml-11">
                {data
                  ? `${hasTenant ? 'Kiracı' : 'Ev Sahibi'}: ${data.tenantName || data.ownerName || 'Bilgi yok'}`
                  : 'Lütfen bir daire seçin.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {data && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bakiye Kartı */}
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                    <Wallet className="h-4 w-4" /> Finansal Durum
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-end border-b pb-4">
                        <span className="text-sm font-medium">Toplam Bakiye</span>
                        <div className={`text-3xl font-bold tracking-tight ${balanceClass}`}>
                           {formatCurrency(data.balance)}
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                        <span className="text-sm text-muted-foreground">Geçmiş Borçlar</span>
                        <span className="font-mono text-sm">{formatCurrency(data.openingBalance || 0)}</span>
                    </div>
                </div>
              </div>

              {/* Sakin Bilgileri */}
              <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                 <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <User className="h-4 w-4" /> Sakin Bilgileri
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                         <span className="text-sm font-medium">Yönetici Rolü</span>
                         <Badge variant={data.isManager ? "default" : "outline"}>
                            {data.isManager ? 'Yönetici' : 'Sakin'}
                         </Badge>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Ev Sahibi:</span>
                            <span className="font-medium">{data.ownerName || '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Kiracı:</span>
                            <span className="font-medium">{data.tenantName || '-'}</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-muted/10 text-sm text-muted-foreground">
                <p>
                    <strong>Not:</strong> Bu pencereden daireye ait detaylı finansal geçmişi görüntüleyemezsiniz. 
                    Detaylar için <span className="text-primary font-medium cursor-pointer hover:underline">Finansal &gt; Ekstre</span> sayfasına gidiniz.
                </p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline">Kapat</Button>
          </DialogClose>
          {/* İleride 'Düzenle' veya 'Tahsilat Ekle' butonu olabilir */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
