'use client'

import { useState, useEffect, useCallback } from 'react'
import { DuesSetting, DuesSettingSearch } from '@/types'
import { DuesSettingService } from '@/services/due'
import DuesSettingModal from './DuesSettingModal'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { duesSettingColumns } from './dues-setting-columns'
import DuesSettingTable from './DuesSettingTable'
import DuesSettingDeleting from './DuesSettingDeleting'
import { PaginationState } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Separator } from '../ui/separator'

interface DuesSettingsClientProps {
  initialDuesSettings: DuesSetting[]
  initialTotalCount?: number 
}

export default function DuesSettingsClient({ initialDuesSettings, initialTotalCount }: DuesSettingsClientProps) {
  const [duesSettings, setDuesSettings] = useState<DuesSetting[]>(initialDuesSettings)
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount || 0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDuesSetting, setSelectedDuesSetting] = useState<DuesSetting | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [duesSettingToDelete, setDuesSettingToDelete] = useState<DuesSetting | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Pagination State (TanStack Table formatı)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // 0. sayfa = Backend için 1. sayfa
    pageSize: 10,
  })
    
  // --- DATA FETCHING (VERİ ÇEKME) ---
  const fetchDuesSettings = useCallback(async () => {
    try {
      // Backend genelde page=1'den başlar, TanStack pageIndex=0'dan başlar.
      const apiPage = pagination.pageIndex + 1;

      const params : DuesSettingSearch = {
        page: apiPage,
        pageSize: pagination.pageSize,
      }

      const res = await DuesSettingService.searchDuesSettings({ ...params })

      if (res.status === 200 && res.data.isSuccess && res.data.resultObject) {
        setDuesSettings(res.data.resultObject.searchResult)
        setTotalCount(res.data.resultObject.totalItemCount)
      }
    } catch (error) {
      console.error('Aidat ayarları yüklenemedi:', error)
    }
  }, [pagination.pageIndex, pagination.pageSize])

  // İlk render'ı atla, sadece filtre/pagination değiştiğinde API çağrısı yap
  const [isInitialMount, setIsInitialMount] = useState(true)

  // --- EFFECT: Filtreler veya Sayfa Değişince Veri Çek ---
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false)
      return // İlk render'da API çağrısı yapma, initialDuesSettings kullan
    }
    fetchDuesSettings()
  }, [fetchDuesSettings, isInitialMount])

  const handleSave = async (duesSettingData: Omit<DuesSetting, 'id'>) => {
    try {
      if (selectedDuesSetting) {
        // Güncelleme
        const payload = { ...duesSettingData, id: selectedDuesSetting.id }
        const res = await DuesSettingService.createOrEditDuesSetting(payload)
        if (res.status === 200 && res.data.isSuccess) {
          // Serverdan güncel verileri çek
          await fetchDuesSettings()
          toast.success('Aidat bilgisi başarıyla güncellendi')
        }
      } else {
        // Yeni ekleme
        const res = await DuesSettingService.createOrEditDuesSetting(duesSettingData as DuesSetting)
        if (res.status === 200 && res.data.isSuccess) {
          toast.success('Aidat bilgisi başarıyla eklendi')
          // Serverdan güncel verileri çek
          await fetchDuesSettings()
        }
      }
      setSelectedDuesSetting(null)
    } catch (error) {
      console.error('Aidat bilgisi kaydedilemedi:', error)
       toast.error("Aidat bilgisi kaydedilemedi. Lütfen tekrar deneyin.");

      throw error
    }
  }

  const handleDelete = async () => {
    if (!duesSettingToDelete || isDeleting) return

    const duesSettingIdToDelete = duesSettingToDelete.id
    setIsDeleting(true)

    try {
      const res = await DuesSettingService.deleteDuesSetting(duesSettingIdToDelete)
      if (res.status === 200 && res.data.isSuccess) {
        toast.success('Aidat ayarı başarıyla silindi')
        // Serverdan güncel verileri çek
        await fetchDuesSettings()
        // Dialog'u kapat ve state'i temizle
        setDeleteDialogOpen(false)
        setDuesSettingToDelete(null)
      } else {
        // Başarısız olursa da dialog'u kapat
        console.error('Aidat ayarı silinemedi:', res.data.message || 'Bilinmeyen hata')
        setDeleteDialogOpen(false)
        setDuesSettingToDelete(null)
      }
    } catch (error) {
      console.error('Aidat ayarı silinemedi:', error)
      // Hata durumunda da dialog'u kapat
      setDeleteDialogOpen(false)
      setDuesSettingToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (duesSetting: DuesSetting) => {
    setSelectedDuesSetting(duesSetting)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedDuesSetting(null)
    setIsModalOpen(true)
  }


  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Aidat Tutarı Belirle</h1>
            <p className="text-muted-foreground mt-1">
              Daire tiplerine göre aidat tutarlarını yönetin.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              Yeni Aidat Tutarı
            </Button>
          </div>
        </div>
        
        <Separator />

        {/* Aidat Ayarları Listesi */}
        <DuesSettingTable 
          columns={duesSettingColumns}
          data={duesSettings}
          searchQuery=""
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          setDuesSettingToDelete={setDuesSettingToDelete}
          setDeleteDialogOpen={setDeleteDialogOpen}
          // Pagination Props
          totalCount={totalCount}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>

      {/* Ekleme/Düzenleme Modal */}
      <DuesSettingModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setSelectedDuesSetting(null)
        }}
        duesSetting={selectedDuesSetting}
        onSave={handleSave}
      />

      {/* Silme Onay Dialog */}
      <DuesSettingDeleting 
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        duesSettingToDelete={duesSettingToDelete}
        setDuesSettingToDelete={setDuesSettingToDelete}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
      />
    </>
  )
}

