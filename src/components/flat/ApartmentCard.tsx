'use client'

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Home, Wallet, Pencil } from "lucide-react";
import { Apartment } from "@/types";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";

interface ApartmentCardProps {
  data: Apartment;
  onClick?: () => void;
  onUpdateClick?: (e: React.MouseEvent) => void;
  canUpdate?: boolean;
}

export default function ApartmentCard({ data, onClick, onUpdateClick, canUpdate }: ApartmentCardProps) {
  const isInDebt = data.balance < 0;
  
  // Basit bir mantık: Kiracı adı varsa "Kiracı", yoksa "Ev Sahibi" (Varsayım)
  // Gerçek veride 'status' alanı olsa daha iyi olurdu.
  const isTenant = !!data.tenantName;
  const statusLabel = isTenant ? "Kiracı" : "Ev Sahibi";
  const statusVariant = isTenant ? "secondary" : "default";

  return (
    <Card 
      className="group relative cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4"
      style={{ borderLeftColor: isInDebt ? "hsl(var(--destructive))" : "hsl(var(--primary))" }}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
             <Home className="h-5 w-5" />
          </div>
          <div>
             <h3 className="font-bold text-lg leading-none">{data.label}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canUpdate && onUpdateClick && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateClick(e);
              }}
              title="Daire bilgilerini güncelle"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          <Badge variant={statusVariant} className="font-normal">
            {statusLabel}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center gap-3 rounded-md bg-muted/50 p-2 text-sm">
           <User className="h-4 w-4 text-muted-foreground" />
           <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Sakin:</span>
              <span className="font-medium truncate max-w-[150px]">
                {data.tenantName || data.ownerName}
              </span>
           </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex justify-between items-center border-t bg-muted/20">
         <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Wallet className="h-3 w-3" /> Alacak Bakiye
         </span>
         <span className={cn(
            "text-lg font-bold tabular-nums",
            isInDebt ? "text-destructive" : "text-emerald-600"
         )}>
            {formatCurrency(data.balance)}
         </span>
      </CardFooter>
    </Card>
  );
}