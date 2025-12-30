import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Wallet, Activity } from "lucide-react"; // İkonlar

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Yönetim Paneli
      </h1>

      {/* KPI Kartları Alanı - Responsive Grid */}
      <div className="grid gap-4 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Kart 1: Toplam Daire */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Daire
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              2 Blok (A - B)
            </p>
          </CardContent>
        </Card>

        {/* Kart 2: Doluluk */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doluluk Oranı
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">%92</div>
            <p className="text-xs text-muted-foreground">
              +4% geçen aydan beri
            </p>
          </CardContent>
        </Card>

        {/* Kart 3: Bekleyen Aidat */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bekleyen Aidat
            </CardTitle>
            <Wallet className="h-4 w-4 text-red-500" /> {/* Dikkat çeksin diye kırmızı */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺12,450</div>
            <p className="text-xs text-muted-foreground">
              8 daire ödeme yapmadı
            </p>
          </CardContent>
        </Card>

        {/* Kart 4: Talepler */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktif Talepler
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Son 24 saatte +1
            </p>
          </CardContent>
        </Card>
        
      </div>

      {/* İleride buraya Tablo ve Grafikler gelecek */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 border rounded-md p-4 h-64 flex items-center justify-center bg-slate-50">
             Grafik Alanı (Yakında)
          </div>
          <div className="col-span-3 border rounded-md p-4 h-64 flex items-center justify-center bg-slate-50">
             Son Aktiviteler (Yakında)
          </div>
      </div>
    </div>
  );
}

// import ApartmentGrid from "@/components/ApartmentGrid";
// // Burada normalde 'fetch' veya veri tabanı sorgusu olur

// export default async function Home() {
//   // Simüle edilmiş backend verisi
//   const apartmentData = [
//     { 
//       id: "1", number: 12, block: "A", residentName: "Taner Saydam", 
//       balance: -2450, status: "owner",
//       transactions: [
//         { date: "20.12.2023", amount: -1500, description: "Aralık Aidat" },
//         { date: "15.11.2023", amount: 2000, description: "EFT Ödeme" }
//       ]
//     },
//     // ... daha fazla veri
//   ];

//   return (
//     <div className="container mx-auto py-6">
//       <h1 className="text-3xl font-bold mb-8">Daire Yönetimi</h1>
//       <ApartmentGrid data={apartmentData as any} />
//     </div>
//   );
// }