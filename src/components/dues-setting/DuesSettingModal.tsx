'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { DuesSetting } from '@/types'
import { Plus, Pencil } from 'lucide-react'
import { toast } from 'sonner'

interface DuesSettingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  duesSetting?: DuesSetting | null
  onSave: (duesSetting: Omit<DuesSetting, 'id'>) => Promise<void>
}

export default function DuesSettingModal({ open, onOpenChange, duesSetting, onSave }: DuesSettingModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    startDate: '',
    endDate: '',
    description: '',
    isActive: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (duesSetting) {
      setFormData({
        amount: duesSetting.amount.toString(),
        startDate: duesSetting.startDate.split('T')[0], // YYYY-MM-DD formatına çevir
        endDate: duesSetting.endDate.split('T')[0],
        description: duesSetting.description || '',
        isActive: duesSetting.isActive,
      })
    } else {
      setFormData({
        amount: '',
        startDate: '',
        endDate: '',
        description: '',
        isActive: true,
      })
    }
  }, [duesSetting, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Lütfen geçerli bir tutar girin')
      return
    }

    if (!formData.startDate || !formData.endDate) {
      alert('Lütfen başlangıç ve bitiş tarihlerini girin')
      return
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('Bitiş tarihi başlangıç tarihinden önce olamaz')
      return
    }

    setIsLoading(true)

    try {
      await onSave({
        amount: parseFloat(formData.amount),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        description: formData.description.trim() || undefined,
        isActive: formData.isActive,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Aidat ayarı kaydedilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {duesSetting ? (
              <>
                <Pencil className="h-5 w-5" />
                Aidat Ayarı Düzenle
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Yeni Aidat Ayarı Ekle
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {duesSetting ? 'Aidat ayarı bilgilerini güncelleyin' : 'Yeni bir aidat ayarı oluşturun'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Aidat Tutarı (₺) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Örn: 500.00"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Başlangıç Tarihi *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Bitiş Tarihi *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Aidat ayarı hakkında açıklama (opsiyonel)"
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Aktif
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Kaydediliyor...' : duesSetting ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

