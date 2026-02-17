/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useCallback } from 'react' // useEffect ve useCallback eklendi
import { Income, IncomeCategory, Apartment, IncomeSummaryDto, IncomeSearch } from '@/types'
import { IncomeService } from '@/services/income'
import IncomeModal from './IncomeModal'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { incomeColumns } from '../table/income-columns'
import IncomeStatistic from './IncomeStatistic'
import IncomeFilter from './IncomeFilter'
import IncomeTable from './IncomeTable'
import IncomeDeleting from './IncomeDeleting'
import { PaginationState } from '@tanstack/react-table'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Separator } from '../ui/separator'

interface IncomesClientProps {
  initialIncomes: Income[]
  initialIncomeCategories: IncomeCategory[]
  initialApartments: Apartment[]
  initialTotalCount?: number 
  reports: IncomeSummaryDto
}

export default function IncomesClient({ 
  initialIncomes, 
  initialIncomeCategories, 
  initialApartments,
  initialTotalCount,
  reports
}: IncomesClientProps) {
  const router = useRouter()
  
  // --- STATE YÖNETİMİ ---
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes)
  
  // Pagination State (TanStack Table formatı)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // 0. sayfa = Backend için 1. sayfa
    pageSize: 5,
  })

  // Filtreler
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  // Modallar ve Diğerleri
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [incomeToDelete, setIncomeToDelete] = useState<Income | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // --- DATA FETCHING (VERİ ÇEKME) ---
  const fetchIncomes = useCallback(async () => {
    try {
      // Backend genelde page=1'den başlar, TanStack pageIndex=0'dan başlar.
      const apiPage = pagination.pageIndex + 1;

      const isNumber = !isNaN(Number(searchQuery)) && searchQuery.trim() !== '';

      const params : IncomeSearch = {
        page: apiPage,
        pageSize: pagination.pageSize,
        apartmentNo: isNumber ? searchQuery : undefined,
        incomeCategoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
        keyword: !isNumber && searchQuery.trim() !== '' ? searchQuery : undefined,
      }

      const res = await IncomeService.searchIncomes(params)

      if (res.status === 200 && res.data.isSuccess && res.data.resultObject) {
        setIncomes(res.data.resultObject.searchResult)
      }
    } catch (error) {
      console.error('Gelirler yüklenemedi:', error)
    }
  }, [pagination.pageIndex, pagination.pageSize, searchQuery, selectedCategory])

  // İlk render'ı atla, sadece filtre/pagination değiştiğinde API çağrısı yap
  const [isInitialMount, setIsInitialMount] = useState(true)

  // --- EFFECT: Filtreler veya Sayfa Değişince Veri Çek ---
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false)
      return // İlk render'da API çağrısı yapma, initialIncomes kullan
    }
    fetchIncomes()
  }, [fetchIncomes, isInitialMount])

  // Arama yapıldığında sayfayı başa sar (UX kuralı)
  // useEffect(() => {
  //   setPagination(prev => ({ ...prev, pageIndex: 0 }))
  // }, [searchQuery, selectedCategory])

  const handleSearchChange = (val: string) => {
     setSearchQuery(val);
     // Arama değiştiği an sayfayı 1'e çek, useEffect kullanma
     setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }

  const handleCategoryChange = (val: string) => {
     setSelectedCategory(val);
     // Kategori değiştiği an sayfayı 1'e çek
     setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }


  // --- CRUD İŞLEMLERİ ---
  const handleSave = async (incomeData: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
        const category = initialIncomeCategories.find(c => c.id === incomeData.incomeCategoryId)
        const apartment = incomeData.apartmentId ? initialApartments.find(a => a.id === incomeData.apartmentId) : null
        
        const payload = {
            ...incomeData,
            incomeCategory: category?.name || 'Unknown',
            apartmentNo: apartment?.label
        } as Income

        let res;
        if (selectedIncome) {
           const updatedIncome = {
          ...incomeData,
          id: selectedIncome.id,
          incomeCategory: category?.name || 'Unknown',
          apartmentNo: apartment?.label
        }
            res = await IncomeService.createOrEditIncome(updatedIncome)
        } else {
            res = await IncomeService.createOrEditIncome(payload)
        }

        if (res.status === 200 && res.data.isSuccess) {
            await fetchIncomes() // Listeyi yenile
            router.refresh() // İstatistikler ve sunucu verilerini güncelle
            setIsModalOpen(false)
            setSelectedIncome(null)
            if (selectedIncome) {
                toast.success('Gelir başarıyla güncellendi')
            } else {
                toast.success('Gelir başarıyla eklendi')
            }
        }
    } catch (error) {
        console.error('İşlem başarısız:', error)
        toast.error('Gelir kaydedilemedi. Lütfen tekrar deneyin.')
    }
  }

  const handleDelete = async () => {
    if (!incomeToDelete) return
    setIsDeleting(true)
    try {
      const res = await IncomeService.deleteIncome(incomeToDelete.id)
      if (res.status === 200 && res.data.isSuccess) {
        await fetchIncomes() // Listeyi yenile
        router.refresh() // İstatistikler ve sunucu verilerini güncelle
        setDeleteDialogOpen(false)
        setIncomeToDelete(null)
        toast.success('Gelir başarıyla silindi')
      } else {
        toast.error('Gelir silinemedi. Lütfen tekrar deneyin.')
      }
    } catch (error) {
        console.error('Silme başarısız:', error)
        toast.error('Gelir silinemedi. Lütfen tekrar deneyin.')
    } finally {
        setIsDeleting(false)
    }
  }

  const handleEdit = (income: Income) => {
    setSelectedIncome(income)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedIncome(null)
    setIsModalOpen(true)
  }  

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gelirler</h1>
            <p className="text-muted-foreground mt-1">Site gelirlerini detaylı olarak yönetin ve takip edin.</p>
          </div>
          <Button onClick={handleAdd} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> Yeni Gelir Ekle
          </Button>
        </div>
        
        <Separator />

        {/* İstatistik (Backend destekli olması önerilir) */}
         <IncomeStatistic reports={reports} /> 

        {/* Filtreler */}
        <IncomeFilter 
          initialIncomeCategories={initialIncomeCategories} 
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange} // Artık state değişince useEffect tetiklenecek
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
        />

        {/* Tablo */}
        <IncomeTable 
          columns={incomeColumns}
          data={incomes} // Client-side filter edilmiş veri değil, direkt API verisi
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          
          // Pagination Props
          totalCount={initialTotalCount || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          
          // Actions
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          setIncomeToDelete={setIncomeToDelete}
          setDeleteDialogOpen={setDeleteDialogOpen}
        />
      </div>

      {/* Modals */}
      <IncomeModal
        incomeCategories={initialIncomeCategories}
        apartments={initialApartments}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if(!open) setSelectedIncome(null)
        }}
        income={selectedIncome}
        onSave={handleSave}
      />

      <IncomeDeleting 
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        incomeToDelete={incomeToDelete}
        setIncomeToDelete={setIncomeToDelete as any}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
      />
    </>
  )
}