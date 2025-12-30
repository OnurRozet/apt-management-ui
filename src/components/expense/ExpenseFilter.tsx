import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Filter, Search } from 'lucide-react'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface ExpenseFilterProps {
  initialExpenseCategories: { id: number; name: string }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const ExpenseFilter: React.FC<ExpenseFilterProps> = ({
  initialExpenseCategories,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div>
      <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Gider ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="relative flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tüm Kategoriler" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Kategoriler</SelectItem>
                    {initialExpenseCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

export default ExpenseFilter
