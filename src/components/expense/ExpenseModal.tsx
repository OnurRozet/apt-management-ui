'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Expense, ExpenseCategory } from '@/types'
import { Plus, Pencil } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface ExpenseModalProps {
  expenseCategories: ExpenseCategory[]
  open: boolean
  onOpenChange: (open: boolean) => void
  expense?: Expense | null
  onSave: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
}

export default function ExpenseModal({expenseCategories, open, onOpenChange, expense, onSave }: ExpenseModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    expenseCategoryId: 0,
    expenseDate: new Date().toISOString().split('T')[0],
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        description: expense.description || '',
        amount: expense.amount.toString(),
        expenseCategoryId: expense.expenseCategoryId,
        expenseDate: expense.expenseDate.split('T')[0],
      })
    } else {
      setFormData({
        title: '',
        description: '',
        amount: '',
        expenseCategoryId: 0,
        expenseDate: new Date().toISOString().split('T')[0],
      })
    }
  }, [expense, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.expenseCategoryId || formData.expenseCategoryId === 0) {
      alert('Lütfen bir kategori seçin')
      return
    }

    setIsLoading(true)

    try {
      await onSave({
        title: formData.title,
        description: formData.description || undefined,
        amount: parseFloat(formData.amount),
        expenseCategoryId: formData.expenseCategoryId,
        expenseDate: formData.expenseDate,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Gider kaydedilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {expense ? (
              <>
                <Pencil className="h-5 w-5" />
                Gider Düzenle
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Yeni Gider Ekle
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {expense ? 'Gider bilgilerini güncelleyin' : 'Yeni bir gider kaydı oluşturun'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Örn: Asansör Bakımı"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <Select
              value={formData.expenseCategoryId?.toString() || ''}
              onValueChange={(value) => setFormData({ ...formData, expenseCategoryId: parseInt(value) || 0 })}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
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
              id="expenseDate"
              type="date"
              value={formData.expenseDate}
              onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
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
              {isLoading ? 'Kaydediliyor...' : expense ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

