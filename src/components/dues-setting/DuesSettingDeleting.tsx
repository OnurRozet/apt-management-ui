import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { DuesSetting } from '@/types'

interface DuesSettingDeletingProps {
    deleteDialogOpen: boolean
    setDeleteDialogOpen: (open: boolean) => void
    duesSettingToDelete: DuesSetting | null
    setDuesSettingToDelete: (duesSetting: DuesSetting | null) => void
    isDeleting: boolean
    handleDelete: () => void
}

const DuesSettingDeleting = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  duesSettingToDelete,
  setDuesSettingToDelete,
  isDeleting,
  handleDelete
}: DuesSettingDeletingProps) => {
  return (
    <div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aidat Ayarını Sil</DialogTitle>
            <DialogDescription>
              {`${duesSettingToDelete ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(duesSettingToDelete.amount) : ''}`} tutarındaki aidat ayarını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteDialogOpen(false)
                setDuesSettingToDelete(null)
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

export default DuesSettingDeleting

