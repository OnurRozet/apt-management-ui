import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { ManagementPeriodDto } from '@/types'

interface ManagementPeriodDeletingProps {
    deleteDialogOpen: boolean
    setDeleteDialogOpen: (open: boolean) => void
    periodToDelete: ManagementPeriodDto | null
    setPeriodToDelete: (period: ManagementPeriodDto | null) => void
    isDeleting: boolean
    handleDelete: () => void
}

const ManagementPeriodDeleting = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  periodToDelete,
  setPeriodToDelete,
  isDeleting,
  handleDelete
}: ManagementPeriodDeletingProps) => {
  return (
    <div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yönetim Dönemini Sil</DialogTitle>
            <DialogDescription>
              Bu yönetim dönemini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteDialogOpen(false)
                setPeriodToDelete(null)
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

export default ManagementPeriodDeleting

