import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'

interface ExpenseDeletingProps {
    deleteDialogOpen: boolean
    setDeleteDialogOpen: (open: boolean) => void
    expenseToDelete: { id: number; title: string } | null
    setExpenseToDelete: (id:number | null) => void
    isDeleting: boolean
    handleDelete: () => void
}

const ExpenseDeleting = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  expenseToDelete,
  setExpenseToDelete,
  isDeleting,
  handleDelete
}: ExpenseDeletingProps) => {
  return (
    <div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gideri Sil</DialogTitle>
            <DialogDescription>
              {`${expenseToDelete?.title}`} adlı gideri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteDialogOpen(false)
                setExpenseToDelete(null)
              }}
              disabled={isDeleting}
            >
              İptal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Siliniyor...' : 'Sil'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ExpenseDeleting
