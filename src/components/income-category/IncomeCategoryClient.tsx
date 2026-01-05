'use client'

import { useState, useEffect, useCallback } from 'react'
import { IncomeCategory, IncomeCategorySearch } from '@/types'
import { IncomeCategoryService } from '@/services/income'
import IncomeCategoryModal from './IncomeCategoryModal'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { incomeCategoryColumns } from './income-category-columns'
import IncomeCategoryTable from './IncomeCategoryTable'
import IncomeCategoryDeleting from './IncomeCategoryDeleting'
import { PaginationState } from '@tanstack/react-table'
import { Input } from '../ui/input'
import { toast } from 'sonner'

interface IncomeCategoryClientProps {
  initialCategories: IncomeCategory[]
  initialTotalCount?: number 
}

export default function IncomeCategoryClient({ initialCategories, initialTotalCount }: IncomeCategoryClientProps) {
  const [categories, setCategories] = useState<IncomeCategory[]>(initialCategories)
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount || 0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<IncomeCategory | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<IncomeCategory | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Pagination State (TanStack Table formatı)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // 0. sayfa = Backend için 1. sayfa
    pageSize: 10,
  })
    
  // --- DATA FETCHING (VERİ ÇEKME) ---
  const fetchCategories = useCallback(async () => {
    try {
      // Backend genelde page=1'den başlar, TanStack pageIndex=0'dan başlar.
      const apiPage = pagination.pageIndex + 1;

      const params : IncomeCategorySearch = {
        page: apiPage,
        pageSize: pagination.pageSize,
        name: searchQuery.trim() !== '' ? searchQuery : undefined,
      }

      const res = await IncomeCategoryService.searchIncomesCategory({ ...params })

      if (res.status === 200 && res.data.isSuccess && res.data.resultObject) {
        setCategories(res.data.resultObject.searchResult)
        setTotalCount(res.data.resultObject.totalItemCount)
      }
    } catch (error) {
      console.error('Gelir kategorileri yüklenemedi:', error)
    }
  }, [pagination.pageIndex, pagination.pageSize, searchQuery])

  // İlk render'ı atla, sadece filtre/pagination değiştiğinde API çağrısı yap
  const [isInitialMount, setIsInitialMount] = useState(true)

  // --- EFFECT: Filtreler veya Sayfa Değişince Veri Çek ---
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false)
      return // İlk render'da API çağrısı yapma, initialCategories kullan
    }
    fetchCategories()
  }, [fetchCategories, isInitialMount])
  
  // Arama yapıldığında sayfayı başa sar (UX kuralı)
  useEffect(() => {
    if (!isInitialMount) {
      setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }
  }, [searchQuery, isInitialMount])

  const handleSave = async (categoryData: Omit<IncomeCategory, 'id'>) => {
    try {
      if (selectedCategory) {
        // Güncelleme
        const res = await IncomeCategoryService.updateIncomeCategory(selectedCategory.id, categoryData as IncomeCategory)
        if (res.status === 200 && res.data.isSuccess) {
          // Serverdan güncel verileri çek
          await fetchCategories()
          toast.success('Gelir kategorisi başarıyla güncellendi')
        }
      } else {
        // Yeni ekleme
        const res = await IncomeCategoryService.createOrEditIncomeCategory(categoryData as IncomeCategory)
        if (res.status === 200 && res.data.isSuccess) {
          // Serverdan güncel verileri çek
          await fetchCategories()
          toast.success('Gelir kategorisi başarıyla eklendi')
        }
      }
      setSelectedCategory(null)
    } catch (error) {
      console.error('Kategori kaydedilemedi:', error)
      toast.error('Gelir kategorisi kaydedilemedi. Lütfen tekrar deneyin.')
      throw error
    }
  }

  const handleDelete = async () => {
    if (!categoryToDelete || isDeleting) return

    const categoryIdToDelete = categoryToDelete.id
    setIsDeleting(true)

    try {
      const res = await IncomeCategoryService.deleteIncomeCategory(categoryIdToDelete)
      if (res.status === 200 && res.data.isSuccess) {
        // Serverdan güncel verileri çek
        await fetchCategories()
        // Dialog'u kapat ve state'i temizle
        setDeleteDialogOpen(false)
        setCategoryToDelete(null)
        toast.success('Gelir kategorisi başarıyla silindi')
      } else {
        // Başarısız olursa da dialog'u kapat
        console.error('Kategori silinemedi:', res.data.message || 'Bilinmeyen hata')
        setDeleteDialogOpen(false)
        setCategoryToDelete(null)
        toast.error('Gelir kategorisi silinemedi. Lütfen tekrar deneyin.')
      }
    } catch (error) {
      console.error('Kategori silinemedi:', error)
      // Hata durumunda da dialog'u kapat
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
      toast.error('Gelir kategorisi silinemedi. Lütfen tekrar deneyin.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (category: IncomeCategory) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gelir Kategorileri</h1>
            <p className="text-muted-foreground mt-1">
              Gelir kategorilerini yönetin
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Yeni Kategori Ekle
            </Button>
          </div>
        </div>

        {/* Arama */}
        <div className="space-y-2">
          <Input
            placeholder="Kategori adı ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Kategoriler Listesi */}
        <IncomeCategoryTable 
          columns={incomeCategoryColumns}
          data={categories}
          searchQuery={searchQuery}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          setCategoryToDelete={setCategoryToDelete}
          setDeleteDialogOpen={setDeleteDialogOpen}
          // Pagination Props
          totalCount={totalCount}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>

      {/* Ekleme/Düzenleme Modal */}
      <IncomeCategoryModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setSelectedCategory(null)
        }}
        category={selectedCategory}
        onSave={handleSave}
      />

      {/* Silme Onay Dialog */}
      <IncomeCategoryDeleting 
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        categoryToDelete={categoryToDelete}
        setCategoryToDelete={(id) => setCategoryToDelete(id ? categoryToDelete : null)}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
      />
    </>
  )
}

