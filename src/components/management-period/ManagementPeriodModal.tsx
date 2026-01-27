'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ManagementPeriodDto, Apartment } from '@/types'
import { Plus, Pencil } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface ManagementPeriodModalProps {
  apartments: Apartment[]
  open: boolean
  onOpenChange: (open: boolean) => void
  period?: ManagementPeriodDto | null
  onSave: (period: Omit<ManagementPeriodDto, 'id'>) => Promise<void>
}

export default function ManagementPeriodModal({
  apartments,
  open,
  onOpenChange,
  period,
  onSave
}: ManagementPeriodModalProps) {
  const [formData, setFormData] = useState({
    apartmentId: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    isExemptFromDues: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (period) {
      setFormData({
        apartmentId: period.apartmentId,
        startDate: period.startDate.split('T')[0],
        endDate: period.endDate.split('T')[0],
        isExemptFromDues: period.isExemptFromDues,
      })
    } else {
      setFormData({
        apartmentId: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        isExemptFromDues: false,
      })
    }
  }, [period, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.apartmentId || formData.apartmentId === 0) {
      alert('Lütfen bir daire seçin')
      return
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('Başlangıç tarihi bitiş tarihinden sonra olamaz')
      return
    }

    setIsLoading(true)

    try {
      await onSave({
        apartmentId: formData.apartmentId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isExemptFromDues: formData.isExemptFromDues,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Yönetim dönemi kaydedilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {period ? (
              <>
                <Pencil className="h-5 w-5" />
                Yönetim Dönemi Düzenle
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Yeni Yönetim Dönemi Ekle
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {period ? 'Yönetim dönemi bilgilerini güncelleyin' : 'Yeni bir yönetim dönemi oluşturun'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apartment">Daire *</Label>
            <Select
              value={formData.apartmentId?.toString() || ''}
              onValueChange={(value) => setFormData({ ...formData, apartmentId: parseInt(value) || 0 })}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Daire seçin" />
              </SelectTrigger>
              <SelectContent>
                {apartments.map((apt) => (
                  <SelectItem key={apt.id} value={apt.id.toString()}>
                    {apt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isExemptFromDues"
                checked={formData.isExemptFromDues}
                onChange={(e) => setFormData({ ...formData, isExemptFromDues: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isExemptFromDues" className="cursor-pointer">
                Aidattan muaf
              </Label>
            </div>
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
              {isLoading ? 'Kaydediliyor...' : period ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

