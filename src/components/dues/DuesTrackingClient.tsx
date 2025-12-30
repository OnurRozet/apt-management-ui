'use client'

import { useState } from 'react'
import {PaymentMatrixDto } from '@/types'
import DuesYearlyTable from './DuesYearlyTable'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface DuesTrackingClientProps {
  paymentMatrix: PaymentMatrixDto[];
}

export default function DuesTrackingClient({
  paymentMatrix,
}: DuesTrackingClientProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const handlePreviousYear = () => {
    setSelectedYear((prev) => prev - 1)
  }

  const handleNextYear = () => {
    setSelectedYear((prev) => prev + 1)
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(Number(value))
  }

  // Yıl seçenekleri (mevcut yıl ± 5 yıl)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aidat Takibi</h1>
          <p className="text-muted-foreground mt-1">Daire bazında yıllık aidat ödeme durumunu takip edin</p>
        </div>

        {/* Yıl Seçici */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousYear}
            disabled={selectedYear <= currentYear - 5}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-35">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextYear}
            disabled={selectedYear >= currentYear + 5}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Yıllık Tablo */}
      <DuesYearlyTable data={paymentMatrix} />
    </div>
  )
}

