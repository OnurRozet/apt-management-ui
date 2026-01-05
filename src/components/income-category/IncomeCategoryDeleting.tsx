import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'

interface IncomeCategoryDeletingProps {
    deleteDialogOpen: boolean
    setDeleteDialogOpen: (open: boolean) => void
    categoryToDelete: { id: number; name: string } | null
    setCategoryToDelete: (id: number | null) => void
    isDeleting: boolean
    handleDelete: () => void
}

const IncomeCategoryDeleting = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  categoryToDelete,
  setCategoryToDelete,
  isDeleting,
  handleDelete
}: IncomeCategoryDeletingProps) => {
  return (
    <div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gelir Kategorisini Sil</DialogTitle>
            <DialogDescription>
              {`${categoryToDelete?.name}`} adlı gelir kategorisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteDialogOpen(false)
                setCategoryToDelete(null)
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

export default IncomeCategoryDeleting

