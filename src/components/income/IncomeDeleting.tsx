import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'

interface IncomeDeletingProps {
    deleteDialogOpen: boolean
    setDeleteDialogOpen: (open: boolean) => void
    incomeToDelete: { id: number; title: string } | null
    setIncomeToDelete: (id:number | null) => void
    isDeleting: boolean
    handleDelete: () => void
}

const IncomeDeleting = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  incomeToDelete,
  setIncomeToDelete,
  isDeleting,
  handleDelete
}: IncomeDeletingProps) => {
  return (
    <div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Geliri Sil</DialogTitle>
            <DialogDescription>
              {`${incomeToDelete?.title}`} adlı geliri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteDialogOpen(false)
                setIncomeToDelete(null)
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

export default IncomeDeleting

