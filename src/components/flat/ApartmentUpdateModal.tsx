'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Apartment } from '@/types'
import { Pencil, Home } from 'lucide-react'
import { toast } from 'sonner'

interface ApartmentUpdateModalProps {
  apartment: Apartment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (apartment: Apartment) => Promise<void>
}

export default function ApartmentUpdateModal({
  apartment,
  open,
  onOpenChange,
  onSave,
}: ApartmentUpdateModalProps) {
  const [formData, setFormData] = useState({
    label: '',
    ownerName: '',
    tenantName: '',
    isManager: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (apartment) {
      setFormData({
        label: apartment.label,
        ownerName: apartment.ownerName,
        tenantName: apartment.tenantName || '',
        isManager: apartment.isManager,
      })
    }
  }, [apartment, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apartment) return

    if (!formData.label.trim()) {
      toast.error('Daire numarası zorunludur')
      return
    }

    if (!formData.ownerName.trim()) {
      toast.error('Ev sahibi adı zorunludur')
      return
    }

    setIsLoading(true)

    try {
      await onSave({
        ...apartment,
        label: formData.label.trim(),
        ownerName: formData.ownerName.trim(),
        tenantName: formData.tenantName.trim() || undefined,
        isManager: formData.isManager,
      })
      toast.success('Daire bilgileri güncellendi')
      onOpenChange(false)
    } catch (error) {
      console.error('Daire güncellenemedi:', error)
      toast.error('Daire güncellenemedi. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Pencil className="h-5 w-5" />
            </div>
            Daire Bilgilerini Güncelle
          </DialogTitle>
          <DialogDescription>
            {apartment ? (
              <>
                <span className="flex items-center gap-1.5">
                  <Home className="h-4 w-4 inline" />
                  {apartment.label} - Bilgileri düzenleyin
                </span>
              </>
            ) : (
              'Lütfen bir daire seçin.'
            )}
          </DialogDescription>
        </DialogHeader>

        {apartment && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="label">Daire No *</Label>
              <Input
                id="label"
                placeholder="Örn: 101, A Blok 2"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName">Ev Sahibi *</Label>
              <Input
                id="ownerName"
                placeholder="Ev sahibinin adı soyadı"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenantName">Kiracı (opsiyonel)</Label>
              <Input
                id="tenantName"
                placeholder="Kiracı varsa adı soyadı"
                value={formData.tenantName}
                onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="flex items-center space-x-2 rounded-lg border p-4">
              <Input
                type="checkbox"
                id="isManager"
                checked={formData.isManager}
                onChange={(e) => setFormData({ ...formData, isManager: e.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="isManager" className="cursor-pointer font-normal">
                Bu daire yönetici rolüne sahip
              </Label>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Kaydediliyor...' : 'Güncelle'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
