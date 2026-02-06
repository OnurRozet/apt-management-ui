import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Mehmet Yılmaz</p>
          <p className="text-xs text-muted-foreground">
            A Blok - Daire 4
          </p>
        </div>
        <div className="ml-auto font-medium">+₺1,999.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Ayşe Demir</p>
          <p className="text-xs text-muted-foreground">
            B Blok - Daire 12
          </p>
        </div>
        <div className="ml-auto font-medium">+₺39.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>EK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Emre Kaya</p>
          <p className="text-xs text-muted-foreground">
            A Blok - Daire 8
          </p>
        </div>
        <div className="ml-auto font-medium">+₺299.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>ZD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Zeynep Doğan</p>
          <p className="text-xs text-muted-foreground">
            B Blok - Daire 2
          </p>
        </div>
        <div className="ml-auto font-medium">+₺99.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Ali Can</p>
          <p className="text-xs text-muted-foreground">
            A Blok - Daire 1
          </p>
        </div>
        <div className="ml-auto font-medium">+₺39.00</div>
      </div>
    </div>
  )
}
