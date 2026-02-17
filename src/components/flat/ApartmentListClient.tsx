'use client'

import { useState } from 'react'
import Link from 'next/link'
import ApartmentCard from './ApartmentCard'
import { Apartment } from '@/types'
import InfoFlatModal from './InfoFlatModal'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

interface ApartmentListClientProps {
  apartments: Apartment[]
}

export default function ApartmentListClient({ apartments }: ApartmentListClientProps) {
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (apt: Apartment) => {
    setSelectedApartment(apt)
    setIsModalOpen(true)
  }

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setSelectedApartment(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Daireler</h2>
          <p className="text-muted-foreground">
            Sitedeki tüm dairelerin durumunu ve bakiye bilgilerini buradan yönetebilirsiniz.
          </p>
        </div>
        <Button asChild variant="default">
          <Link href="/flats/import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Toplu Daire Ekle
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {apartments.map((apt) => (
          <ApartmentCard
            key={apt.id}
            data={apt}
            onClick={() => handleCardClick(apt)}
          />
        ))}
      </div>

      <InfoFlatModal 
        data={selectedApartment || undefined} 
        open={isModalOpen}
        onOpenChange={handleModalClose}
      />
    </div>
  )
}

