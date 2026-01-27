'use client'

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Home } from "lucide-react";
import { Apartment } from "@/types";
import { formatCurrency } from "@/lib/formatCurrency";

interface ApartmentCardProps {
  data: Apartment;
  onClick?: () => void;
}

export default function ApartmentCard({ data, onClick }: ApartmentCardProps) {
  
  // Bakiye rengini belirleme (Senior dokunuşu: logic'i render içinde temiz tut)
  const isInDebt = data.balance < 0;

  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-all duration-200 hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-muted-foreground" />
          <span className="font-bold text-lg">{data.label}</span>
        </div>
        <Badge variant={data.ownerName === "empty" ? "secondary" : "outline"}>
          {data.ownerName === "owner" ? "Ev Sahibi" : data.ownerName === "tenant" ? "Kiracı" : "Boş"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-600 truncate">
            {data.tenantName || "Sakin Bilgisi Yok"}
          </span>
        </div>
        
        <div className="flex justify-between items-end">
          <span className="text-xs text-muted-foreground uppercase font-semibold">Alacak Bakiye</span>
          <span className={`text-lg font-bold ${isInDebt ? "text-red-500" : "text-emerald-500"}`}>
            {formatCurrency(data.balance)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}