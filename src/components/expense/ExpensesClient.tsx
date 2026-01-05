'use client'

import { useState, useEffect, useCallback } from 'react'
import { Expense, ExpenseCategory, ExpenseSearch, ExpenseSummaryDto } from '@/types'
import { ExpenseService } from '@/services/expense'
import ExpenseModal from './ExpenseModal'
import { Button } from '../ui/button'
import { 
  Plus, 
} from 'lucide-react'
import { columns } from '../table/columns'
import ExpenseStatistic from './ExpenseStatistic'
import ExpenseFilter from './ExpenseFilter'
import ExpenseTable from './ExpenseTable'
import ExpenseDeleting from './ExpenseDeleting'
import { PaginationState } from '@tanstack/react-table'
import { toast } from 'sonner'

interface ExpensesClientProps {
  initialExpenses: Expense[]
  initialExpenseCategories: ExpenseCategory[]
  initialTotalCount?: number 
  reports?: ExpenseSummaryDto
}



export default function ExpensesClient({ initialExpenses, initialExpenseCategories, initialTotalCount, reports }: ExpensesClientProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount || 0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  // Pagination State (TanStack Table formatı)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // 0. sayfa = Backend için 1. sayfa
    pageSize: 5,
  })
    


  // --- DATA FETCHING (VERİ ÇEKME) ---
  const fetchExpenses = useCallback(async () => {
    try {
      // Backend genelde page=1'den başlar, TanStack pageIndex=0'dan başlar.
      const apiPage = pagination.pageIndex + 1;

      const isNumber = !isNaN(Number(searchQuery)) && searchQuery.trim() !== '';

      const params : ExpenseSearch = {
        page: apiPage,
        pageSize: pagination.pageSize,
        expenseCategoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
        keyword: !isNumber && searchQuery.trim() !== '' ? searchQuery : undefined,
      }

      const res = await ExpenseService.searchExpenses({ ...params })

      if (res.status === 200 && res.data.isSuccess && res.data.resultObject) {
        setExpenses(res.data.resultObject.searchResult)
        setTotalCount(res.data.resultObject.totalItemCount)
      }
    } catch (error) {
      console.error('Giderler yüklenemedi:', error)
    }
  }, [pagination.pageIndex, pagination.pageSize, searchQuery, selectedCategory])

  // İlk render'ı atla, sadece filtre/pagination değiştiğinde API çağrısı yap
  const [isInitialMount, setIsInitialMount] = useState(true)

  // --- EFFECT: Filtreler veya Sayfa Değişince Veri Çek ---
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false)
      return // İlk render'da API çağrısı yapma, initialExpenses kullan
    }
    fetchExpenses()
  }, [fetchExpenses, isInitialMount])
  
  // Arama yapıldığında sayfayı başa sar (UX kuralı)
  useEffect(() => {
    if (!isInitialMount) {
      setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }
  }, [searchQuery, selectedCategory, isInitialMount])

  const handleSave = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Kategori bilgisini bul
      const category = initialExpenseCategories.find(
        (cat) => cat.id === expenseData.expenseCategoryId
      )
      const expenseCategoryName = category?.name || 'Unknown'

      if (selectedExpense) {
        // Güncelleme
        const updatedExpense = {
          ...expenseData,
          id: selectedExpense.id,
          expenseCategory: expenseCategoryName,
        }
        const res = await ExpenseService.createOrEditExpense(updatedExpense as Expense)
        if (res.status === 200 && res.data.isSuccess) {
          // Serverdan güncel verileri çek
          await fetchExpenses()
          toast.success('Gider başarıyla güncellendi')
        }
      } else {
        // Yeni ekleme
        const res = await ExpenseService.createOrEditExpense(expenseData as Expense)
        if (res.status === 200 && res.data.isSuccess) {
          // Serverdan güncel verileri çek
          await fetchExpenses()
          toast.success('Gider başarıyla eklendi')
        }
      }
      setSelectedExpense(null)
    } catch (error) {
      console.error('Gider kaydedilemedi:', error)
      toast.error('Gider kaydedilemedi. Lütfen tekrar deneyin.')
      throw error
    }
  }

  const handleDelete = async () => {
    if (!expenseToDelete || isDeleting) return

    const expenseIdToDelete = expenseToDelete.id
    setIsDeleting(true)

    try {
      const res = await ExpenseService.deleteExpense(expenseIdToDelete)
      if (res.status === 200 && res.data.isSuccess) {
        // Serverdan güncel verileri çek
        await fetchExpenses()
        // Dialog'u kapat ve state'i temizle
        setDeleteDialogOpen(false)
        setExpenseToDelete(null)
        toast.success('Gider başarıyla silindi')
      } else {
        // Başarısız olursa da dialog'u kapat
        console.error('Gider silinemedi:', res.data.message || 'Bilinmeyen hata')
        setDeleteDialogOpen(false)
        setExpenseToDelete(null)
        toast.error('Gider silinemedi. Lütfen tekrar deneyin.')
      }
    } catch (error) {
      console.error('Gider silinemedi:', error)
      // Hata durumunda da dialog'u kapat
      setDeleteDialogOpen(false)
      setExpenseToDelete(null)
      toast.error('Gider silinemedi. Lütfen tekrar deneyin.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedExpense(null)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Giderler</h1>
            <p className="text-muted-foreground mt-1">
              Site giderlerini yönetin ve takip edin
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Yeni Gider Ekle
            </Button>
          </div>
        </div>

        {/* İstatistikler */}
        <ExpenseStatistic reports={reports} />

        {/* Filtreleme ve Arama */}
        <ExpenseFilter 
          initialExpenseCategories={initialExpenseCategories} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Giderler Listesi */}
        <ExpenseTable 
          columns={columns}
          data={expenses}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          setExpenseToDelete={setExpenseToDelete}
          setDeleteDialogOpen={setDeleteDialogOpen}
          // Pagination Props
          totalCount={totalCount}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>

      {/* Ekleme/Düzenleme Modal */}
      <ExpenseModal
      expenseCategories={initialExpenseCategories}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setSelectedExpense(null)
        }}
        expense={selectedExpense}
        onSave={handleSave}
      />

      {/* Silme Onay Dialog */}
      <ExpenseDeleting 
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        expenseToDelete={expenseToDelete}
        setExpenseToDelete={(id) => setExpenseToDelete(id ? expenseToDelete : null)}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
      />
    </>
  )
}

