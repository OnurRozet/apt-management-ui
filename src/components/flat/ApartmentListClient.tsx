'use client'

import { useState } from 'react'
import ApartmentCard from './ApartmentCard'
import { Apartment } from '@/types'
import InfoFlatModal from './InfoFlatModal'

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </>
  )
}

