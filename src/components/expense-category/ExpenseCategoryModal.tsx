'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ExpenseCategory } from '@/types'
import { Plus, Pencil } from 'lucide-react'

interface ExpenseCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: ExpenseCategory | null
  onSave: (category: Omit<ExpenseCategory, 'id'>) => Promise<void>
}

export default function ExpenseCategoryModal({ open, onOpenChange, category, onSave }: ExpenseCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
      })
    } else {
      setFormData({
        name: '',
        description: '',
      })
    }
  }, [category, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Lütfen kategori adı girin')
      return
    }

    setIsLoading(true)

    try {
      await onSave({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Kategori kaydedilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {category ? (
              <>
                <Pencil className="h-5 w-5" />
                Gider Kategorisi Düzenle
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Yeni Gider Kategorisi Ekle
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {category ? 'Gider kategorisi bilgilerini güncelleyin' : 'Yeni bir gider kategorisi oluşturun'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Kategori Adı *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örn: Bakım ve Onarım"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Kategori hakkında açıklama (opsiyonel)"
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
              {isLoading ? 'Kaydediliyor...' : category ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

