'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Income, IncomeCategory, Apartment } from '@/types'
import { Plus, Pencil } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface IncomeModalProps {
  incomeCategories: IncomeCategory[]
  apartments: Apartment[]
  open: boolean
  onOpenChange: (open: boolean) => void
  income?: Income | null
  onSave: (income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
}

export default function IncomeModal({incomeCategories, apartments, open, onOpenChange, income, onSave }: IncomeModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    incomeCategoryId: 0,
    apartmentId: 0,
    incomeDate: new Date().toISOString().split('T')[0],
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (income) {
      setFormData({
        title: income.title,
        description: income.description || '',
        amount: income.amount.toString(),
        incomeCategoryId: income.incomeCategoryId,
        apartmentId: income.apartmentId || 0,
        incomeDate: income.incomeDate.split('T')[0],
      })
    } else {
      setFormData({
        title: '',
        description: '',
        amount: '',
        incomeCategoryId: 0,
        apartmentId: 0,
        incomeDate: new Date().toISOString().split('T')[0],
      })
    }
  }, [income, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.incomeCategoryId || formData.incomeCategoryId === 0) {
      alert('Lütfen bir kategori seçin')
      return
    }

    setIsLoading(true)

    try {
      await onSave({
        title: formData.title,
        description: formData.description || undefined,
        amount: parseFloat(formData.amount),
        incomeCategoryId: formData.incomeCategoryId,
        apartmentId: formData.apartmentId || undefined,
        incomeDate: formData.incomeDate,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Gelir kaydedilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {income ? (
              <>
                <Pencil className="h-5 w-5" />
                Gelir Düzenle
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Yeni Gelir Ekle
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {income ? 'Gelir bilgilerini güncelleyin' : 'Yeni bir gelir kaydı oluşturun'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Örn: Aidat Ödemesi"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <Select
              value={formData.incomeCategoryId?.toString() || ''}
              onValueChange={(value) => setFormData({ ...formData, incomeCategoryId: parseInt(value) || 0 })}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {incomeCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apartment">Daire</Label>
            <Select
              value={formData.apartmentId?.toString() || ''}
              onValueChange={(value) => setFormData({ ...formData, apartmentId: parseInt(value) || 0 })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Daire seçin (opsiyonel)" />
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
            <Label htmlFor="amount">Tutar (₺) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tarih *</Label>
            <Input
              id="incomeDate"
              type="date"
              value={formData.incomeDate}
              onChange={(e) => setFormData({ ...formData, incomeDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ek bilgiler (opsiyonel)"
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
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
              {isLoading ? 'Kaydediliyor...' : income ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

