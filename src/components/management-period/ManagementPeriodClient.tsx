/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { ManagementPeriodDto, Apartment, ManagementPeriodSearch } from '@/types'
import { ManagementPeriodService } from '@/services/managementPeriod'
import ManagementPeriodModal from './ManagementPeriodModal'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { managementPeriodColumns } from './management-period-columns'
import ManagementPeriodFilter from './ManagementPeriodFilter'
import ManagementPeriodTable from './ManagementPeriodTable'
import ManagementPeriodDeleting from './ManagementPeriodDeleting'
import { PaginationState } from '@tanstack/react-table'
import { toast } from 'sonner'

interface ManagementPeriodClientProps {
  initialPeriods: ManagementPeriodDto[]
  initialApartments: Apartment[]
  initialTotalCount?: number 
}

export default function ManagementPeriodClient({ 
  initialPeriods, 
  initialApartments,
  initialTotalCount
}: ManagementPeriodClientProps) {
  
  // --- STATE YÖNETİMİ ---
  const [periods, setPeriods] = useState<ManagementPeriodDto[]>(initialPeriods)
  
  // Pagination State (TanStack Table formatı)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // 0. sayfa = Backend için 1. sayfa
    pageSize: 5,
  })

  // Filtreler
  const [searchQuery, setSearchQuery] = useState('')

  // Modallar ve Diğerleri
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<ManagementPeriodDto | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [periodToDelete, setPeriodToDelete] = useState<ManagementPeriodDto | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // --- DATA FETCHING (VERİ ÇEKME) ---
  const fetchPeriods = useCallback(async () => {
    try {
      // Backend genelde page=1'den başlar, TanStack pageIndex=0'dan başlar.
      const apiPage = pagination.pageIndex + 1;

      const isNumber = !isNaN(Number(searchQuery)) && searchQuery.trim() !== '';

      const params : ManagementPeriodSearch = {
        page: apiPage,
        pageSize: pagination.pageSize,
        keyword: searchQuery.trim() !== '' ? searchQuery : undefined,
      }

      const res = await ManagementPeriodService.searchPeriods(params)

      if (res.status === 200 && res.data.isSuccess && res.data.resultObject) {
        setPeriods(res.data.resultObject.searchResult)
      }
    } catch (error) {
      console.error('Yönetim dönemleri yüklenemedi:', error)
    }
  }, [pagination.pageIndex, pagination.pageSize, searchQuery])

  // İlk render'ı atla, sadece filtre/pagination değiştiğinde API çağrısı yap
  const [isInitialMount, setIsInitialMount] = useState(true)

  // --- EFFECT: Filtreler veya Sayfa Değişince Veri Çek ---
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false)
      return // İlk render'da API çağrısı yapma, initialPeriods kullan
    }
    fetchPeriods()
  }, [fetchPeriods, isInitialMount])

  const handleSearchChange = (val: string) => {
     setSearchQuery(val);
     // Arama değiştiği an sayfayı 1'e çek
     setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }

  // --- CRUD İŞLEMLERİ ---
  const handleSave = async (periodData: Omit<ManagementPeriodDto, 'id'>) => {
    try {
        const payload = {
            ...periodData,
        } as ManagementPeriodDto

        let res;
        if (selectedPeriod) {
           const updatedPeriod = {
          ...periodData,
          id: selectedPeriod.id,
        }
            res = await ManagementPeriodService.createOrEditPeriod(updatedPeriod)
        } else {
            res = await ManagementPeriodService.createOrEditPeriod(payload)
        }

        if (res.status === 200 && res.data.isSuccess) {
            await fetchPeriods() // Listeyi yenile
            setIsModalOpen(false)
            setSelectedPeriod(null)
            if (selectedPeriod) {
                toast.success('Yönetim dönemi başarıyla güncellendi')
            } else {
                toast.success('Yönetim dönemi başarıyla eklendi')
            }
        }
    } catch (error) {
        console.error('İşlem başarısız:', error)
        toast.error('Yönetim dönemi kaydedilemedi. Lütfen tekrar deneyin.')
    }
  }

  const handleDelete = async () => {
    if (!periodToDelete) return
    setIsDeleting(true)
    try {
      const res = await ManagementPeriodService.deletePeriod(periodToDelete.id)
      if (res.status === 200 && res.data.isSuccess) {
        await fetchPeriods() // Listeyi yenile
        setDeleteDialogOpen(false)
        setPeriodToDelete(null)
        toast.success('Yönetim dönemi başarıyla silindi')
      } else {
        toast.error('Yönetim dönemi silinemedi. Lütfen tekrar deneyin.')
      }
    } catch (error) {
        console.error('Silme başarısız:', error)
        toast.error('Yönetim dönemi silinemedi. Lütfen tekrar deneyin.')
    } finally {
        setIsDeleting(false)
    }
  }

  const handleEdit = (period: ManagementPeriodDto) => {
    setSelectedPeriod(period)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedPeriod(null)
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (period: ManagementPeriodDto) => {
    const newIsActive = period.isActive !== false ? false : true
    try {
      const res = await ManagementPeriodService.createOrEditPeriod({
        ...period,
        isActive: newIsActive,
      })
      if (res.status === 200 && res.data.isSuccess) {
        await fetchPeriods()
        toast.success(newIsActive ? 'Yönetici aktif hale getirildi' : 'Yönetici pasife alındı')
      } else {
        toast.error('Durum güncellenemedi.')
      }
    } catch (error) {
      console.error('Durum güncelleme başarısız:', error)
      toast.error('Durum güncellenemedi. Lütfen tekrar deneyin.')
    }
  }

  // Apartment bilgilerini column'lara eklemek için columns'ı güncelle
  const columnsWithApartmentInfo = managementPeriodColumns.map(col => {
    if (col.accessorKey === 'apartmentId') {
      return {
        ...col,
        cell: ({ row }: any) => {
          const apartmentId = row.getValue<number>("apartmentId")
          const apartment = initialApartments.find(apt => apt.id === apartmentId)
          return apartment ? apartment.label : `Daire ${apartmentId}`
        },
      }
    }
    return col
  })

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Yönetim Dönemleri</h1>
            <p className="text-muted-foreground mt-1">Apartman yöneticilerini yönetin</p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Yeni Yönetim Dönemi Ekle
          </Button>
        </div>

        {/* Filtreler */}
        <ManagementPeriodFilter 
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
        />

        {/* Tablo */}
        <ManagementPeriodTable 
          columns={columnsWithApartmentInfo}
          data={periods}
          searchQuery={searchQuery}
          
          // Pagination Props
          totalCount={initialTotalCount || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          
          // Actions
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          handleToggleStatus={handleToggleStatus}
          setPeriodToDelete={setPeriodToDelete}
          setDeleteDialogOpen={setDeleteDialogOpen}
        />
      </div>

      {/* Modals */}
      <ManagementPeriodModal
        apartments={initialApartments}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if(!open) setSelectedPeriod(null)
        }}
        period={selectedPeriod}
        onSave={handleSave}
      />

      <ManagementPeriodDeleting 
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        periodToDelete={periodToDelete}
        setPeriodToDelete={setPeriodToDelete}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
      />
    </>
  )
}

