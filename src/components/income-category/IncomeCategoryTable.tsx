import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Pencil, Plus, Trash2, Tag } from 'lucide-react'
import { Button } from '../ui/button'
import { DataTable } from '../table/data-table'
import { IncomeCategory } from '@/types'
import { ColumnDef, PaginationState } from "@tanstack/react-table"

interface IncomeCategoryTableProps {
  columns: ColumnDef<IncomeCategory>[]
  data: IncomeCategory[]
  searchQuery: string
  
  // Pagination Props
  totalCount: number
  pagination: PaginationState
  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>

  // Actions
  handleAdd: () => void
  handleEdit: (category: IncomeCategory) => void
  setCategoryToDelete: (category: IncomeCategory) => void
  setDeleteDialogOpen: (open: boolean) => void
}

const IncomeCategoryTable: React.FC<IncomeCategoryTableProps> = ({
  columns,
  data,
  searchQuery,
  totalCount,
  pagination,
  onPaginationChange,
  handleAdd,
  handleEdit,
  setCategoryToDelete,
  setDeleteDialogOpen,
}) => {

  // Toplam Sayfa Sayısı Hesabı
  const pageCount = Math.ceil(totalCount / pagination.pageSize);

  return (
    <div>
      {/* Veri Yoksa ve Arama Yoksa Boş State Göster */}
      {data.length === 0 && !searchQuery ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Tag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gelir kategorisi bulunamadı</h3>
              <p className="text-muted-foreground mb-4">Henüz gelir kategorisi kaydı yok.</p>
              <Button onClick={handleAdd} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                İlk Kategoriyi Ekle
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <DataTable
            columns={columns}
            data={data}
            
            // Pagination Bilgileri
            pageCount={pageCount}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            
            actionsHeader="Aksiyonlar"
            renderActions={(category) => (
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(category)}
                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setCategoryToDelete(category)
                    setDeleteDialogOpen(true)
                  }}
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </div>
      )}
    </div>
  )
}

export default IncomeCategoryTable

