import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Filter, Search } from 'lucide-react'
import { Input } from '../ui/input'

interface ManagementPeriodFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

const ManagementPeriodFilter: React.FC<ManagementPeriodFilterProps> = ({
  searchQuery,
  setSearchQuery,
}) => {  
  return (
    <div>
      <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Daire numarası veya isim ile ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

export default ManagementPeriodFilter

