import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Pencil, Plus, Trash2, TrendingDown } from 'lucide-react'
import { Button } from '../ui/button'
import { DataTable } from '../table/data-table'
import { Expense } from '@/types'
import { ColumnDef, PaginationState } from '@tanstack/react-table'

interface ExpenseTableProps {
  columns: ColumnDef<Expense>[];
  data: Expense[];
  searchQuery: string;
  selectedCategory: string;
  handleAdd: () => void;
  handleEdit: (expense: Expense) => void;
  setExpenseToDelete: (expense: Expense) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  // Pagination Props
  totalCount: number;
  pagination: PaginationState;
  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({
  columns,
  data,
  searchQuery,
  selectedCategory,
  handleAdd,
  handleEdit,
  setExpenseToDelete,
  setDeleteDialogOpen,
  totalCount,
  pagination,
  onPaginationChange,
}) => {
  // Toplam Sayfa Sayısı Hesabı
  const pageCount = Math.ceil(totalCount / pagination.pageSize);
  return (
    <div>
      {data.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingDown className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gider bulunamadı</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory
                  ? "Arama kriterlerinize uygun gider bulunamadı."
                  : "Henüz gider kaydı yok."}
              </p>
              {!searchQuery && !selectedCategory && (
                <Button onClick={handleAdd} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Gideri Ekle
                </Button>
              )}
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
            renderActions={(expense) => (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(expense)}
                  className="h-9 w-9"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setExpenseToDelete(expense);
                    setDeleteDialogOpen(true);
                  }}
                  className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default ExpenseTable
