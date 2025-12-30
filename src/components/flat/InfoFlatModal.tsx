'use client'

import React from 'react'
import { Home, User, Wallet, Crown } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Apartment } from '@/types'

const formatBalance = (value: number) => {
  try {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(value)
  } catch {
    return `${value} ₺`
  }
}

interface InfoFlatModalProps {
  data?: Apartment
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const InfoFlatModal = ({ data, open, onOpenChange }: InfoFlatModalProps) => {
  const hasTenant = Boolean(data?.tenantName)
  const balanceClass = data?.balance && data.balance < 0 ? 'text-red-500' : 'text-emerald-600'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                <Home className="h-5 w-5 text-primary" />
                {data ? `${data.label}` : 'Daire bilgisi bulunamadı'}
              </DialogTitle>
              <DialogDescription>
                {data
                  ? `${hasTenant ? 'Kiracı' : 'Ev Sahibi'}: ${data.tenantName || data.ownerName || 'Bilgi yok'}`
                  : 'Lütfen bir daire seçin.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-xs uppercase text-muted-foreground">Bakiye</p>
                <div className={`mt-2 text-2xl font-semibold ${balanceClass}`}>
                  {formatBalance(data.balance)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Güncel hesap durumu</p>
              </div>

              <div className="rounded-lg border p-4 flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">Ev Sahibi</p>
                  <p className="font-medium text-sm">{data.ownerName || 'Bilgi yok'}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4 flex items-start gap-3">
                <div className="rounded-full bg-amber-50 p-2 text-amber-600">
                  <User className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">Kiracı</p>
                  <p className="font-medium text-sm">{data.tenantName || 'Kiracı bilgisi yok'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 space-y-2 bg-white">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Wallet className="h-4 w-4 text-primary" />
                  Finansal Durum
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Durum</span>
                  <Badge variant={data.balance < 0 ? 'destructive' : 'secondary'}>
                    {data.balance < 0 ? 'Borçlu' : 'Alacaklı / Dengede'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Son Güncelleme</span>
                  <span className="font-medium text-xs">Gerçek zamanlı</span>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3 bg-white">
                <p className="text-sm font-semibold">Genel Bilgiler</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Daire No</p>
                    <p className="font-medium">{data.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Label</p>
                    <p className="font-medium">{data.label}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Yönetim Rolü</p>
                    <p className="font-medium">{data.isManager ? 'Yönetici' : 'Sakin'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Durum</p>
                    <p className="font-medium">{hasTenant ? 'Kiracılı' : 'Mülk Sahibi'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="secondary">Kapat</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InfoFlatModal
